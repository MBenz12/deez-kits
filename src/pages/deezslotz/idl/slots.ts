export type Slots = {
  "version": "0.1.0",
  "name": "slots",
  "instructions": [
    {
      "name": "createGame",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "tokenType",
          "type": "bool"
        },
        {
          "name": "communityWallets",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "royalties",
          "type": {
            "vec": "u16"
          }
        },
        {
          "name": "commissionWallet",
          "type": "publicKey"
        },
        {
          "name": "commissionFee",
          "type": "u16"
        }
      ],
      "returns": null
    },
    {
      "name": "setCommunityWallet",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "communityWallet",
          "type": "publicKey"
        },
        {
          "name": "royalty",
          "type": "u16"
        }
      ],
      "returns": null
    },
    {
      "name": "setCommission",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "commissionWallet",
          "type": "publicKey"
        },
        {
          "name": "commissionFee",
          "type": "u16"
        }
      ],
      "returns": null
    },
    {
      "name": "setWinning",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "winPercents",
          "type": {
            "array": [
              {
                "array": [
                  "u16",
                  3
                ]
              },
              6
            ]
          }
        },
        {
          "name": "jackpot",
          "type": "u64"
        },
        {
          "name": "minRoundsBeforeWin",
          "type": "u8"
        }
      ],
      "returns": null
    },
    {
      "name": "addPlayer",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ],
      "returns": null
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "commissionTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "commissionTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "betNo",
          "type": "u8"
        }
      ],
      "returns": null
    },
    {
      "name": "sendToCommunityWallet",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": null
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "claimer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "claimerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": null
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "claimer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "claimerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": null
    },
    {
      "name": "fund",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": null
    }
  ],
  "accounts": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenType",
            "type": "bool"
          },
          {
            "name": "royalties",
            "type": {
              "vec": "u16"
            }
          },
          {
            "name": "communityWallets",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "commissionWallet",
            "type": "publicKey"
          },
          {
            "name": "commissionFee",
            "type": "u16"
          },
          {
            "name": "mainBalance",
            "type": "u64"
          },
          {
            "name": "communityBalances",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "communityPendingBalances",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "jackpot",
            "type": "u64"
          },
          {
            "name": "winPercents",
            "type": {
              "array": [
                {
                  "array": [
                    "u16",
                    3
                  ]
                },
                6
              ]
            }
          },
          {
            "name": "minRoundsBeforeWin",
            "type": "u8"
          },
          {
            "name": "loseCounter",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "publicKey"
          },
          {
            "name": "earnedMoney",
            "type": "u64"
          },
          {
            "name": "key",
            "type": "publicKey"
          },
          {
            "name": "status",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnauthorizedWallet",
      "msg": "Unauthorized wallet cannot create game"
    },
    {
      "code": 6001,
      "name": "MinimumPrice",
      "msg": "You should bet at least 0.05 sol"
    }
  ]
};

export const IDL: Slots = {
  "version": "0.1.0",
  "name": "slots",
  "instructions": [
    {
      "name": "createGame",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "bump",
          "type": "u8"
        },
        {
          "name": "tokenType",
          "type": "bool"
        },
        {
          "name": "communityWallets",
          "type": {
            "vec": "publicKey"
          }
        },
        {
          "name": "royalties",
          "type": {
            "vec": "u16"
          }
        },
        {
          "name": "commissionWallet",
          "type": "publicKey"
        },
        {
          "name": "commissionFee",
          "type": "u16"
        }
      ],
      "returns": null
    },
    {
      "name": "setCommunityWallet",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "communityWallet",
          "type": "publicKey"
        },
        {
          "name": "royalty",
          "type": "u16"
        }
      ],
      "returns": null
    },
    {
      "name": "setCommission",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "commissionWallet",
          "type": "publicKey"
        },
        {
          "name": "commissionFee",
          "type": "u16"
        }
      ],
      "returns": null
    },
    {
      "name": "setWinning",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "winPercents",
          "type": {
            "array": [
              {
                "array": [
                  "u16",
                  3
                ]
              },
              6
            ]
          }
        },
        {
          "name": "jackpot",
          "type": "u64"
        },
        {
          "name": "minRoundsBeforeWin",
          "type": "u8"
        }
      ],
      "returns": null
    },
    {
      "name": "addPlayer",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "game",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ],
      "returns": null
    },
    {
      "name": "play",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "commissionTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "commissionTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "betNo",
          "type": "u8"
        }
      ],
      "returns": null
    },
    {
      "name": "sendToCommunityWallet",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityWallet",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "communityTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": null
    },
    {
      "name": "claim",
      "accounts": [
        {
          "name": "claimer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "claimerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": null
    },
    {
      "name": "withdraw",
      "accounts": [
        {
          "name": "claimer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "claimerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": null
    },
    {
      "name": "fund",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "payerAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "gameTreasuryAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": null
    }
  ],
  "accounts": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenType",
            "type": "bool"
          },
          {
            "name": "royalties",
            "type": {
              "vec": "u16"
            }
          },
          {
            "name": "communityWallets",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "commissionWallet",
            "type": "publicKey"
          },
          {
            "name": "commissionFee",
            "type": "u16"
          },
          {
            "name": "mainBalance",
            "type": "u64"
          },
          {
            "name": "communityBalances",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "communityPendingBalances",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "jackpot",
            "type": "u64"
          },
          {
            "name": "winPercents",
            "type": {
              "array": [
                {
                  "array": [
                    "u16",
                    3
                  ]
                },
                6
              ]
            }
          },
          {
            "name": "minRoundsBeforeWin",
            "type": "u8"
          },
          {
            "name": "loseCounter",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "player",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "game",
            "type": "publicKey"
          },
          {
            "name": "earnedMoney",
            "type": "u64"
          },
          {
            "name": "key",
            "type": "publicKey"
          },
          {
            "name": "status",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "UnauthorizedWallet",
      "msg": "Unauthorized wallet cannot create game"
    },
    {
      "code": 6001,
      "name": "MinimumPrice",
      "msg": "You should bet at least 0.05 sol"
    }
  ]
};
