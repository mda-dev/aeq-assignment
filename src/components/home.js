import {Button, Col, ListGroup, ListGroupItem, Panel, Row} from 'react-bootstrap'
import React, {Component} from 'react'

import Battle from './battle'
import {autobots} from '../data/autobots'
import {decepticons} from '../data/decepticons'

class Home extends Component {
  state = {
    teamA: [],
    teamD: [],
    battle: false
  }

  componentWillMount() {
    this.setState({
      autobots: this._makeBots(autobots),
      decepticons: this._makeBots(decepticons)
    })
  }

  render() {
    return (
      <div style={{maxWidth: '1440px', margin: '50px auto'}}>
        {!this.state.battle ? this.renderSelectTeams() : this.renderBattle()}
      </div>
    )
  }
  //renders battle component
  renderBattle() {
    return (
      <div>
        <Button bsStyle="warning" onClick={this._handleReset.bind(this)}>
          Pick new teams
        </Button>
        <Battle teamA={this.state.teamA} teamD={this.state.teamD} />
      </div>
    )
  }

  //renders transfformer panels for each transformer
  renderTransformers(transformersArray) {
    return transformersArray.map((bot, i) => {
      const id = `${bot.type}-${i}`
      const isAutobot = bot.type === 'A'
      const color = !this._isInTeam(bot) ? (isAutobot ? 'info' : 'danger') : 'default'
      return (
        <Col lg={3} md={4} sm={3} key={id}>
          <Panel bsStyle={color}>
            <Panel.Heading
              data={id}
              onClick={e => (bot.type === 'A' ? this._handleAutobotClick(e) : this._handleDecepticonClick(e))}>
              <Panel.Title data={id} componentClass="h3">
                {bot.name}
              </Panel.Title>
            </Panel.Heading>
            <Panel.Body>Rating : {bot.rating}</Panel.Body>
          </Panel>
        </Col>
      )
    })
  }

  // render bot selection boxes
  renderSelectTeams() {
    return (
      <Row>
        <Col lg={12} style={{marginBottom: '50px'}}>
          <h3>{'Build your teams by selecting boxes from the two collections below'}</h3>
          <Button bsStyle="success" onClick={this._handleBeginBattle.bind(this)}>
            Begin battle
          </Button>
        </Col>
        <Col lg={6} md={12} sm={12}>
          <Panel bsStyle="info">
            <Panel.Heading>
              <Panel.Title componentClass="h2">Autobots</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <Row>{this.renderTransformers(this.state.autobots)}</Row>
            </Panel.Body>
          </Panel>
          <ListGroup>
            <ListGroupItem bsStyle="info">Autobot Team</ListGroupItem>
            {this.renderTeam('A')}
          </ListGroup>
        </Col>
        <Col lg={6} md={12} sm={12}>
          <Panel bsStyle="danger">
            <Panel.Heading>
              <Panel.Title componentClass="h2">Decepticons</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <Row>{this.renderTransformers(this.state.decepticons)}</Row>
            </Panel.Body>
          </Panel>
          <ListGroup>
            <ListGroupItem bsStyle="danger">Decepticon Team</ListGroupItem>
            {this.renderTeam('D')}
          </ListGroup>
        </Col>
      </Row>
    )
  }

  //renders teams underneath the bot selection
  renderTeam(team = 'A') {
    const bots = team === 'A' ? this.state.teamA : this.state.teamD
    return bots.map((bot, i) => {
      const id = `team-${bot.type}-${i}`
      return <ListGroupItem key={id}>{bot.name}</ListGroupItem>
    })
  }

  // add expra prop rating based on supplied formula
  _makeBots(bots) {
    return bots.map(bot => {
      bot.rating = bot.stats.str + bot.stats.int + bot.stats.spd + bot.stats.end + bot.stats.fpw
      return bot
    })
  }

  // Reset teams and take user back to team select
  _handleReset() {
    this.setState({
      teamA: [],
      teamD: [],
      battle: false
    })
  }

  // Initiate the battle by satting state.battle to true
  _handleBeginBattle() {
    if (this.state.teamA.length > 0 && this.state.teamD.length > 0) {
      this.setState({
        battle: true
      })
    } else {
      alert('You must have at least 1 transformer in each team')
    }
  }

  // add autobot to teamA
  _handleAutobotClick(e) {
    const autobotKey = e.target.attributes.data.value.split('-')[1]
    const autobot = this.state.autobots[autobotKey]
    if (!this.state.teamA.includes(autobot)) {
      this.setState({
        teamA: [...this.state.teamA, autobot]
      })
    }
  }

  // add decepticon to teamD
  _handleDecepticonClick(e) {
    const decepticonKey = e.target.attributes.data.value.split('-')[1]
    const decepticon = this.state.decepticons[decepticonKey]
    if (!this.state.teamD.includes(decepticon)) {
      this.setState({
        teamD: [...this.state.teamD, decepticon]
      })
    }
  }

  // helper function to determine if the bot is already in a team
  _isInTeam(transformer) {
    return transformer.type === 'A' ? this.state.teamA.includes(transformer) : this.state.teamD.includes(transformer)
  }
}

export default Home
