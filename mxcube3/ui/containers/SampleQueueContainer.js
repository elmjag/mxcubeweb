import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CurrentTree from '../components/SampleQueue/CurrentTree';
import HistoryTree from '../components/SampleQueue/HistoryTree';
import * as QueueActions from '../actions/queue';
import * as SampleViewActions from '../actions/sampleview';
import { showTaskForm } from '../actions/taskForm';
import { DragDropContext as dragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';


function mapStateToProps(state) {
  return {
    searchString: state.queue.searchString,
    current: state.queue.current,
    todo: state.queue.todo,
    queueStatus: state.queue.queueStatus,
    history: state.queue.history,
    queue: state.queue.queue,
    sampleInformation: state.queue.sampleList,
    checked: state.queue.checked,
    select_all: state.queue.selectAll,
    mounted: state.queue.manualMount.set,
    rootPath: state.queue.rootPath,
    displayData: state.queue.displayData
  };
}


function mapDispatchToProps(dispatch) {
  return {
    queueActions: bindActionCreators(QueueActions, dispatch),
    sampleViewActions: bindActionCreators(SampleViewActions, dispatch),
    showForm: bindActionCreators(showTaskForm, dispatch)
  };
}


@dragDropContext(HTML5Backend)
@connect(mapStateToProps, mapDispatchToProps)
export default class SampleQueueContainer extends React.Component {

  render() {
    const {
      checked,
      history,
      current,
      sampleInformation,
      queue,
      showForm,
      queueStatus,
      rootPath,
      displayData
    } = this.props;
    const {
      sendToggleCheckBox,
      sendRunSample,
      sendPauseQueue,
      sendUnpauseQueue,
      sendStopQueue,
      sendUnmountSample,
      changeTaskOrder,
      collapseList,
      collapseTask,
      collapseSample,
      deleteTask
    } = this.props.queueActions;

    return (
      <div>
            <div className="queue-body">
                <CurrentTree
                  changeOrder={changeTaskOrder}
                  show={current.collapsed}
                  collapse={collapseList}
                  mounted={current.node}
                  sampleInformation={sampleInformation}
                  queue={queue}
                  toggleCheckBox={sendToggleCheckBox}
                  checked={checked}
                  deleteTask={deleteTask}
                  run={sendRunSample}
                  pause={sendPauseQueue}
                  unpause={sendUnpauseQueue}
                  stop={sendStopQueue}
                  showForm={showForm}
                  unmount={sendUnmountSample}
                  queueStatus={queueStatus}
                  rootPath={rootPath}
                  collapseTask={collapseTask}
                  displayData={displayData}
                />
                <HistoryTree
                  show={history.collapsed}
                  collapse={collapseList}
                  list={history.nodes}
                  sampleInformation={sampleInformation}
                  queue={queue}
                  collapseSample={collapseSample}
                  displayData={displayData}
                />
            </div>
      </div>
    );
  }
}
