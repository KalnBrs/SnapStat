const statRules = {
  pass: {
    Completion: {
      passer: [
        { stat: 'attempts', value: 1 },
        { stat: 'completions', value: 1 },
        { stat: 'passing_yards', fromValue: true }
      ],
      receiver: [
        { stat: 'receptions', value: 1 },
        { stat: 'rec_yards', fromValue: true }
      ],
      tackler: [{ stat: 'tackles', value: 1 }]
    },
    Incomplete: {
      passer: [{ stat: 'attempts', value: 1 }],
      receiver: [{ stat: 'targets', value: 1}]
    },
    Interception: {
      passer: [
        { stat: 'attempts', value: 1 },
        { stat: 'passing_int', value: 1 }
      ],
      interceptor: [
        { stat: 'interceptions', value: 1 },
      ],
      receiver: [{ stat: 'targets', value: 1}]
    },
    Touchdown: {
      passer: [
        { stat: 'attempts', value: 1 },
        { stat: 'completions', value: 1 },
        { stat: 'passing_yards', fromValue: true },
        { stat: 'passing_td', value: 1 }
      ],
      receiver: [
        { stat: 'receptions', value: 1 },
        { stat: 'targets', value: 1},
        { stat: 'rec_yards', fromValue: true },
        { stat: 'rec_td', value: 1 }
      ]
    },
    Fumble: {
      passer: [
        { stat: 'attempts', value: 1 },
        { stat: 'completions', value: 1 },
        { stat: 'passing_yards', fromValue: true }
      ],
      receiver: [
        { stat: 'fumbles', value: 1 },
        { stat: 'receptions', value: 1 },
        { stat: 'rec_yards', fromValue: true }
      ],
      fumble_recoverer: [
        { stat: 'fumble_recovery', value: 1 } 
      ]
    }
  },
// ---------------------------------------------------------------------------------------------------------------------------------------------
  rush: {
    Tackle: {
      rusher: [
        { stat: 'carries', value: 1 },
        { stat: 'run_yards', fromValue: true }
      ],
      tackler: [{ stat: 'tackles', value: 1 }]
    },
    Touchdown: {
      rusher: [
        { stat: 'carries', value: 1 },
        { stat: 'run_yards', fromValue: true },
        { stat: 'run_td', value: 1 }
      ]
    },
    Fumble: {
      rusher: [
        { stat: 'fumbles', value: 1 }
      ],
      fumble_recoverer: [
        { stat: 'fumble_recovery', value: 1 } 
      ]
    },
    "Def Safety": {
        rusher: [
          { stat: 'fumbles', value: 1 }
        ],
        fumble_recoverer: [
          { stat: 'fumble_recovery', value: 1 } 
        ]
    },
  },
// ---------------------------------------------------------------------------------------------------------------------------------------------
  sack: {
    Sack: {
      sacker: [
        { stat: 'sacks', value: 1 },
        { stat: 'tackles', value: 1 }
      ],
      passer: [
        { stat: 'sacked', value: 1 }
      ]
    }
  },
// ---------------------------------------------------------------------------------------------------------------------------------------------
  field_goal: {
    'Field Goal Made': {
      kicker: [
        { stat: 'fg_attempts', value: 1 },
        { stat: 'fg_makes', value: 1 },
        { stat: 'fg_long', fromValue: true }
      ]
    },
    'Field Goal Missed': {
      kicker: [
        { stat: 'fg_attempts', value: 1 }
      ]
    },
    'Field Goal Blocked': {
      kicker: [{ stat: 'fg_attempts', value: 1 }],
      blocker: [{ stat: 'fg_block', value: 1 }]
    }
  },
// ---------------------------------------------------------------------------------------------------------------------------------------------
  extra_point: {
    'Extra Point Made': {
      kicker: [
        { stat: 'extra_made', value: 1 }
      ]
    },
    'Extra Point Missed': {
      kicker: [
        { stat: 'extra_missed', value: 1 }
      ]
    },
    'Extra Point Blocked': {
      blocker: [{ stat: 'extra_block', value: 1 }]
    }
  },
// ---------------------------------------------------------------------------------------------------------------------------------------------
  punt: {
    'Punt Return': {
      punter: [
        { stat: 'punt_attempts', value: 1 },
        { stat: 'punt_yard', fromValue: true }
      ],
      returner: [
        { stat: 'return_attempts', value: 1 },
        { stat: 'return_yards', fromValue: true }
      ]
    },
    'Fair Catch': {
      returner: [
        { stat: 'return_attempts', value: 1 }
      ]
    },
    'Punt Blocked': {
      blocker: [{ stat: 'punt_block', value: 1 }]
    },
    Touchdown: {
      punter: [
        { stat: 'punt_attempts', value: 1 },
        { stat: 'punt_yard', fromValue: true }
      ],
      returner: [
        { stat: 'return_attempts', value: 1 },
        { stat: 'return_touchdown', value: 1 },
        { stat: 'return_yards', fromValue: true }
      ]
    }
  },
// ---------------------------------------------------------------------------------------------------------------------------------------------
  kickoff: {
    'Kick Return': {
      kicker: [
        { stat: 'kickoff_yards', fromValue: true }, // if you're tracking kickoff yards, add a `kickoff_yards` stat
        { stat: 'kickoff_attemepts', value: 1 }
      ],
      returner: [
        { stat: 'return_attempts', value: 1 },
        { stat: 'return_yards', fromValue: true }
      ]
    },
    'On-side': {
      kicker: [
        { stat: 'kickoff_yards', fromValue: true }, // if you're tracking kickoff yards, add a `kickoff_yards` stat
        { stat: 'onside_successful', value: 1 }
      ]
    },
    Touchback: {
      kicker: [
        { stat: 'kickoff_attemepts', value: 1 } 
      ]
    },
    Touchdown: {
      kicker: [
        { stat: 'kick', value: 1 },
        { stat: 'kickoff_yard', fromValue: true }
      ],
      returner: [
        { stat: 'return_attempts', value: 1 },
        { stat: 'return_touchdown', value: 1 },
        { stat: 'return_yards', fromValue: true }
      ]
    }
  },
// ---------------------------------------------------------------------------------------------------------------------------------------------
  defense: {
    'Pick-Six': {
      defender: [
        { stat: 'def_td', value: 1 },
        { stat: 'interceptions', value: 1 },
      ],
      passer: [
        { stat: 'attempts', value: 1 },
        { stat: 'passing_int', value: 1 }
      ],
      receiver: [{ stat: 'targets', value: 1}]
    },
    'Scoop and score': {
      fumbler: [
        { stat: 'fumbles', value: 1 }
      ],
      fumble_recoverer: [
        { stat: 'fumble_recovery', value: 1 },
        { stat: 'def_td', value: 1}
      ], 
    },
    'Blocked punt TD': {
      punter: [
        { stat: 'punt_attempts', value: 1 }
      ],
      blocker: [
        { stat: 'punt_block', value: 1 },
        { stat: 'def_td', value: 1}
      ]
    },
    'Blocked kick TD': {
      kicker: [
        { stat: 'fg_attempts', value: 1 }
      ],
      blocker: [
        { stat: 'fg_block', value: 1 },
        { stat: 'def_td', value: 1}
      ]
    },
    'Blocked extra TD': {
      kicker: [
        { stat: 'extra_missed', value: 1 }
      ],
      blocker: [
        { stat: 'extra_block', value: 1 },
        { stat: 'def_td', value: 1}
      ]
    }
  }
};

const applyStatRules = (play) => {
  const { play_type, result, players } = play;
  const ruleSet = statRules[play_type]?.[result];
  if (!ruleSet) return {}; // No matching rules

  const updates = {};
  for (let player of players) {
    const { player_id, role, value} = player

    const rulesForRole = ruleSet[role]
    if (!rulesForRole) continue
    updates[player_id] = rulesForRole.map(rule => ({
      stat: rule.stat,
      value: rule.fromValue ? parseInt(value, 10) : rule.value
    }))
  }

  return updates
}

module.exports = { applyStatRules }
