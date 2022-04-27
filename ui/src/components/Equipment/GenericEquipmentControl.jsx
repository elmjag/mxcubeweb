import React from 'react';
import { Row, Col, Accordion, Alert, Button } from 'react-bootstrap';
import Form from '@rjsf/core';
import './GenericEquipmentControl.css';

export default class GenericEquipmentControl extends React.Component {
    handleRunCommand(cmd, formData) {
    this.props.executeCommand(this.props.equipment.name, cmd, formData)
  }

  renderParameters(key) {
    const a = this.props.equipment.attributes;
    const attr = a[key];

    if (attr.signature.length > 1) {
      const schema = JSON.parse(attr.schema);

      return (
        <div>
          <h3>Arguments:</h3>
          <Form
            onSubmit={(formData, e) => this.handleRunCommand(key, formData.formData, e)}
            disabled={this.props.equipment.state !== 'READY'}
            schema={schema}
          >
            <Button className='mt-3' variant='outline-secondary' type="submit"><b>Run {key}</b></Button>
          </Form>
        </div>
      );
    } else {
        return (
          <span>
            <p>(No arguments)</p>
            <Button className='mt-3' variant='outline-secondary' type="submit" onClick={(e) => this.handleRunCommand(key, {}, e)}>
              <b>Run {key}</b>
            </Button>
           </span>
        );
    }
  }

  renderInfo(key) {
    const a = this.props.equipment.attributes;
    const attr = a[key];

    if (attr.signature.length > 1) {
      const schema = JSON.parse(attr.schema);
      delete schema.definitions;
      delete schema.type;
      delete schema.title

      return (
        <div>
          <h3>Signature</h3>
          <pre>
            {JSON.stringify(schema,null,'\t')}
          </pre>
        </div>
      );
    } else {
        return (<p/>);
    }
  }

  getCommands() {
    const a = this.props.equipment.attributes;

    return Object.entries(a).map(([key, value]) => {
      return (
       <Accordion defaultActiveKey="0" className="command-panel mb-2">
         <Accordion.Item>
           <Accordion.Header><b>Command: {key}</b></Accordion.Header>
           <Accordion.Body className='mb-2'>
             <Row>
              <Col className="col-xs-6">
                {this.renderParameters(key)}
              </Col>
              <Col className="col-xs-6">
                {this.renderInfo(key)}
              </Col>
             </Row>
           </Accordion.Body>
          </Accordion.Item>
       </Accordion>
      );
    })
  }

  titleBackgroundClass(){
    let titleBackground = 'danger';

    if (this.props.equipment.state=== 'READY') {
        titleBackground = 'success';
      } else if (this.props.equipment.state=== 'MOVING') {
        titleBackground = 'warning';
      } else if (this.props.equipment.state=== 'DISABLED') {
        titleBackground = 'default';
      }

      return titleBackground;
  }

  render() {
    return (
      <Row className='mb-2 generic-equipment-container'>
        <Col sm={12} className=''>
            <Accordion defaultActiveKey="0">
              <Accordion.Item>
                <Accordion.Header className='custom-accordion-header'>
                  <Alert style={{ margin: '0px' }} variant={this.titleBackgroundClass()}>
                  {this.props.equipment.name} ({this.props.equipment.state})
                </Alert>
              </Accordion.Header>
              <Accordion.Body className="p-3 generic-equipment-container-panel-body">
                {this.getCommands()}
                {this.renderDialog}
              </Accordion.Body>
              </Accordion.Item>
            </Accordion>
        </Col>
      </Row>
    );
  }
}
