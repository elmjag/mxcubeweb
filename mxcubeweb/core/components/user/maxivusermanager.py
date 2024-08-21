import logging
import uuid

import flask
import flask_security
from flask_login import current_user
from mxcubecore import HardwareRepository as HWR

from mxcubeweb.core.components.component_base import ComponentBase
from mxcubeweb.core.components.user.usermanager import UserManager
from mxcubeweb.core.models.usermodels import User
from mxcubeweb.core.util.convertutils import convert_to_dict
from mxcubeweb.core.util.networkutils import (
    is_local_host,
    remote_addr,
)


class MAXIVUserManager(UserManager):
    def __init__(self, app, config):
        super().__init__(app, config)
        logging.getLogger("MX3.HWR").info("MAXIVUserManager initialized")

    def login(self, login_id: str, password: str):
        logging.getLogger("MX3.HWR").info("MAXIVUserManager login {}".format(login_id))

        try:
            login_res = self._login(login_id, password)
        except Exception:
            raise
        else:
            if "sid" not in flask.session:
                flask.session["sid"] = str(uuid.uuid4())

            # Making sure that the session of any in active users are invalideted
            # before calling login
            self.update_active_users()
            user = self.db_create_user(login_id, password, login_res)
            self.app.server.user_datastore.activate_user(user)
            flask_security.login_user(user, remember=False)

            # Important to make flask_security user tracking work
            self.app.server.security.datastore.commit()

            address, barcode = self.app.sample_changer.get_loaded_sample()
            # MAX IV always will check SC contents and sync with lims on login/refresh
            self.app.sample_changer.get_sample_list()

            self.app.lims.synch_with_lims()
            self.update_operator(new_login=True)

            msg = "MAX IV User %s signed in" % user.username
            logging.getLogger("MX3.HWR").info(msg)
            samples = self.app.lims.sample_list_get()
            logging.getLogger("MX3.HWR").info(
                "MAXIVUserManager number of samples pre-filtering {}".format(
                    len(samples.get("sampleList"))
                )
            )

            self.app.lims.filter_out_non_lims()
            logging.getLogger("MX3.HWR").info(
                "MAXIVUserManager non lims samples filtered out"
            )
            logging.getLogger("MX3.HWR").info(
                "MAXIVUserManager number of samples {}".format(
                    len(samples.get("sampleList"))
                )
            )
