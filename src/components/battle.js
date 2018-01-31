import {Col, Label, ListGroup, ListGroupItem, Panel, Row} from 'react-bootstrap'
import React, {Component} from 'react'

class Battle extends Component {
  state = {}
  componentWillMount() {
    // sort the two teams by rating
    this.props.teamA.sort((a, b) => b.rating - a.rating)
    this.props.teamD.sort((a, b) => b.rating - a.rating)
    // get optimus prime and Predaking
    // needed for fight logic
    this.setState({
      optimusPrime: this.props.teamA.filter(e => e.name === 'Optimus Prime')[0],
      predaking: this.props.teamD.filter(e => e.name === 'Predaking')[0]
    })
  }

  render() {
    const warResults = this.startWar()
    const survivors = this.renderSurvivors(warResults)
    const survivorsText = !warResults.epic ? 'Survivors that did not fight' : 'No Survivors'
    return (
      <div>
        <h2>Score</h2>
        <div>{this.renderScore(warResults)}</div>
        <ListGroup>{this.renderWar(warResults)}</ListGroup>
        <ListGroup>
          <ListGroupItem bsStyle="info">{survivorsText}</ListGroupItem>
          {!warResults.epic ? survivors : null}
        </ListGroup>
      </div>
    )
  }

  // starts war between the 2 teams
  startWar() {
    const teamA = this.props.teamA
    const teamD = this.props.teamD
    const equalized = this.equalizeTeams(teamA, teamD)
    const teams = equalized.teams
    const survivors = equalized.survivors
    let battles = []

    for (var i = 0; i < teams[0].length; i++) {
      const epicBattle = battles.find(battle => battle.type === 'optimus vs predakill')
      if (epicBattle) {
        battles.push(this.doFight(teams[0][i], teams[1][i], true))
      } else {
        battles.push(this.doFight(teams[0][i], teams[1][i]))
      }
    }
    const wasEpicFight = battles.find(battle => battle.type === 'optimus vs predakill')
    return wasEpicFight ? {battles, survivors, epic: true} : {battles, survivors, epic: false}
  }

  // renders results of all match objects
  renderWar(warResults) {
    let epicWar = warResults.epic
    return warResults.battles.map((battle, i) => {
      return (
        <ListGroupItem key={`battle-${i}`}>
          <Row>
            <Col lg={4}>{this.renderTransformerBox(battle.bots[0], epicWar)}</Col>
            <Col lg={4}>
              <Label bsStyle="primary">
                {epicWar && battle.type !== 'optimus vs predakill' ? 'optimus vs predakill aftermath' : battle.type}
              </Label>
            </Col>
            <Col lg={4}>{this.renderTransformerBox(battle.bots[1], epicWar)}</Col>
          </Row>
        </ListGroupItem>
      )
    })
  }

  // renders transformer from a match object
  renderTransformerBox(transformer, epicWar) {
    let color, banner
    if (epicWar) {
      color = 'danger'
      banner = 'Destroyed'
    } else {
      color = transformer.victory ? 'success' : 'danger'
      banner = transformer.victory ? 'Survived' : 'Destroyed'
    }

    return (
      <Panel bsStyle={color} style={{marginBottom: 0}}>
        <Panel.Heading>
          <Panel.Title componentClass="h2">
            {transformer.name} - {banner}
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Label bsStyle="default">{transformer.name}</Label>
          <Label bsStyle="warning">{transformer.type}</Label>
          <Label bsStyle="primary">{transformer.stats.str}</Label>
          <Label bsStyle="primary">{transformer.stats.int}</Label>
          <Label bsStyle="primary">{transformer.stats.spd}</Label>
          <Label bsStyle="primary">{transformer.stats.end}</Label>
          <Label bsStyle="primary">{transformer.stats.rnk}</Label>
          <Label bsStyle="primary">{transformer.stats.cou}</Label>
          <Label bsStyle="primary">{transformer.stats.fpw}</Label>
          <Label bsStyle="primary">{transformer.stats.skl}</Label>
          <Label bsStyle="info">{transformer.rating}</Label>
        </Panel.Body>
      </Panel>
    )
  }

  // renders survivors that did not fight
  renderSurvivors(battles) {
    return battles.survivors.map((s, i) => {
      const key = `${s.name}-${i}`
      return (
        <ListGroupItem key={key}>
          <Label bsStyle="default">{s.name}</Label>
          <Label bsStyle="warning">{s.type}</Label>
          <Label bsStyle="primary">{s.stats.str}</Label>
          <Label bsStyle="primary">{s.stats.int}</Label>
          <Label bsStyle="primary">{s.stats.spd}</Label>
          <Label bsStyle="primary">{s.stats.end}</Label>
          <Label bsStyle="primary">{s.stats.rnk}</Label>
          <Label bsStyle="primary">{s.stats.cou}</Label>
          <Label bsStyle="primary">{s.stats.fpw}</Label>
          <Label bsStyle="primary">{s.stats.skl}</Label>
        </ListGroupItem>
      )
    })
  }

  // renders overall score
  renderScore(warResult) {
    let autobots = 0
    let decepticons = 0
    let message = 'Tie between autobots and decepticons'
    const battles = warResult.battles
    for (var i = 0; i < battles.length; i++) {
      if (battles[i].bots[0].victory) {
        autobots += 1
      }
      if (battles[i].bots[1].victory) {
        decepticons += 1
      }
    }

    if (autobots > decepticons) {
      message = 'Autobots win!'
    } else if (autobots < decepticons) {
      message = 'Decepticons win!'
    }

    return (
      <div>
        <h3>
          {autobots}-{decepticons}
        </h3>
        <h3>{message}</h3>
      </div>
    )
  }

  // generate a match obj from comparison of 2 bots
  doFight = (bot1, bot2, wasEpicFight = false) => {
    const oponents = [bot1, bot2]
    const optimus = this.state.optimusPrime
    const predaking = this.state.predaking
    let battle = {
      type: 'overall rating win',
      bots: [
        {
          name: bot1.name,
          stats: bot1.stats,
          type: bot1.type,
          victory: false,
          rating: bot1.rating
        },
        {
          name: bot2.name,
          stats: bot2.stats,
          type: bot2.type,
          victory: false,
          rating: bot2.rating
        }
      ]
    }

    if (wasEpicFight) {
      battle.type = 'optimus vs predakill aftermath'
      return battle
    }
    // figure out if it's a battle between optimus and predaking
    if (oponents.indexOf(optimus) !== -1 && oponents.indexOf(predaking) !== -1) {
      battle.type = 'optimus vs predakill'
      return battle
      // automaticly win the fight as Optimus
    } else if (oponents.indexOf(optimus) !== -1) {
      battle.type = 'optimus vs normal win'
      battle.bots[oponents.indexOf(optimus)].victory = true
      return battle
      // automaticly win the fight as Predaking
    } else if (oponents.indexOf(predaking) !== -1) {
      battle.type = 'normal vs predaking win'
      battle.bots[oponents.indexOf(predaking)].victory = true
      return battle
    } else {
      const skillDifference = bot1.stats.skl - bot2.stats.skl
      // Win because of skill diffrence > 3
      if (skillDifference >= 3) {
        battle.type = 'skill difference win'
        battle.bots[0].victory = true
        return battle
      }
      if (skillDifference <= -3) {
        battle.type = 'skill difference win'
        battle.bots[1].victory = true
        return battle
      }

      // Win because of courage difference
      const courageDifference = bot1.stats.cou - bot2.stats.cou
      const strengthDifference = bot1.stats.str - bot2.stats.str
      if (courageDifference >= 4 && strengthDifference >= 3) {
        battle.type = 'courage and strength difference win'
        battle.bots[0].victory = true
        return battle
      }

      if (courageDifference <= -4 && strengthDifference <= -3) {
        battle.type = 'courage and strength difference win'
        battle.bots[1].victory = true
        return battle
      }

      // Win based on overall rating
      if (bot1.rating > bot2.rating) {
        battle.bots[0].victory = true
        return battle
      }
      if (bot2.rating > bot1.rating) {
        battle.bots[1].victory = true
        return battle
      }
      // it's a tie
      if (bot2.rating === bot1.rating) {
        battle.type = 'draw'
        return battle
      }
    }
  }

  // remove autobots that will not fight set them as survivors
  equalizeTeams(teamA, teamD) {
    let survivors = []
    const diff = teamA.length - teamD.length
    if (diff && diff < 0) {
      survivors = teamD.splice(teamA.length)
    } else if (diff && diff > 0) {
      survivors = teamA.splice(teamD.length)
    }
    return {teams: [teamA, teamD], survivors}
  }
}

export default Battle
