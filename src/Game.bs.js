// Generated by BUCKLESCRIPT VERSION 4.0.6, PLEASE EDIT WITH CARE

import * as List from "bs-platform/lib/es6/list.js";
import * as Block from "bs-platform/lib/es6/block.js";
import * as Chess from "./Chess.bs.js";
import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Printf from "bs-platform/lib/es6/printf.js";
import * as Zipper from "./Zipper.bs.js";
import * as Tea_cmd from "bucklescript-tea/src-ocaml/tea_cmd.js";
import * as Tea_html from "bucklescript-tea/src-ocaml/tea_html.js";

function move(param_0) {
  return /* Move */Block.__(0, [param_0]);
}

var init = /* record */[
  /* position */Chess.init_position,
  /* moves */Zipper.init
];

function simple_move(move, san) {
  return /* record */[
          /* move */move,
          /* san */san
        ];
}

function jump(model, how_many) {
  var jump_fwd = function (_position, _zipper, _n) {
    while(true) {
      var n = _n;
      var zipper = _zipper;
      var position = _position;
      if (n <= 0) {
        return /* tuple */[
                position,
                zipper
              ];
      } else {
        var match = Zipper.fwd(zipper);
        _n = n - 1 | 0;
        _zipper = match[1];
        _position = Chess.make_move$prime(position, match[0][/* move */0]);
        continue ;
      }
    };
  };
  var jump_back = function (_position, _zipper, _n) {
    while(true) {
      var n = _n;
      var zipper = _zipper;
      var position = _position;
      var match = position[/* prev */5];
      if (match !== undefined && n < 0) {
        _n = n + 1 | 0;
        _zipper = Zipper.back(zipper);
        _position = match;
        continue ;
      } else {
        return /* tuple */[
                position,
                zipper
              ];
      }
    };
  };
  try {
    if (how_many !== 0) {
      var match = how_many > 0 ? jump_fwd(model[/* position */0], model[/* moves */1], how_many) : jump_back(model[/* position */0], model[/* moves */1], how_many);
      return /* record */[
              /* position */match[0],
              /* moves */match[1]
            ];
    } else {
      return model;
    }
  }
  catch (exn){
    return model;
  }
}

function update(model, param) {
  if (typeof param === "number") {
    if (param === 0) {
      var match = model[/* position */0][/* prev */5];
      if (match !== undefined) {
        try {
          var moves = Zipper.back(model[/* moves */1]);
          return /* tuple */[
                  /* record */[
                    /* position */match,
                    /* moves */moves
                  ],
                  Tea_cmd.none
                ];
        }
        catch (exn){
          if (exn === Zipper.Beginning_of_list) {
            return /* tuple */[
                    model,
                    Tea_cmd.none
                  ];
          } else {
            throw exn;
          }
        }
      } else {
        return /* tuple */[
                model,
                Tea_cmd.none
              ];
      }
    } else {
      return /* tuple */[
              jump(model, 1),
              Tea_cmd.none
            ];
    }
  } else if (param.tag) {
    var how_many = param[0];
    var jump_fwd = function (_position, _zipper, _n) {
      while(true) {
        var n = _n;
        var zipper = _zipper;
        var position = _position;
        if (n <= 0) {
          return /* tuple */[
                  position,
                  zipper
                ];
        } else {
          var match = Zipper.fwd(zipper);
          _n = n - 1 | 0;
          _zipper = match[1];
          _position = Chess.make_move$prime(position, match[0][/* move */0]);
          continue ;
        }
      };
    };
    var jump_back = function (_position, _zipper, _n) {
      while(true) {
        var n = _n;
        var zipper = _zipper;
        var position = _position;
        var match = position[/* prev */5];
        if (match !== undefined && n < 0) {
          _n = n + 1 | 0;
          _zipper = Zipper.back(zipper);
          _position = match;
          continue ;
        } else {
          return /* tuple */[
                  position,
                  zipper
                ];
        }
      };
    };
    try {
      if (how_many !== 0) {
        var match$1 = how_many > 0 ? jump_fwd(model[/* position */0], model[/* moves */1], how_many) : jump_back(model[/* position */0], model[/* moves */1], how_many);
        return /* tuple */[
                /* record */[
                  /* position */match$1[0],
                  /* moves */match$1[1]
                ],
                Tea_cmd.none
              ];
      } else {
        return /* tuple */[
                model,
                Tea_cmd.none
              ];
      }
    }
    catch (exn$1){
      return /* tuple */[
              model,
              Tea_cmd.none
            ];
    }
  } else {
    var move = param[0];
    try {
      var san = Chess.san_of_move(model[/* position */0], move);
      var position = Chess.make_move(model[/* position */0], move, 0);
      return /* tuple */[
              /* record */[
                /* position */position,
                /* moves */Zipper.fwd$prime(/* record */[
                      /* move */move,
                      /* san */san
                    ], model[/* moves */1])
              ],
              Tea_cmd.none
            ];
    }
    catch (exn$2){
      if (exn$2 === Chess.Illegal_move) {
        return /* tuple */[
                model,
                Tea_cmd.none
              ];
      } else {
        throw exn$2;
      }
    }
  }
}

function move_list_view(ply, param) {
  var home_view = function (highlight, offset) {
    return Tea_html.li(undefined, undefined, /* :: */[
                Tea_html.classList(/* :: */[
                      /* tuple */[
                        "move",
                        true
                      ],
                      /* :: */[
                        /* tuple */[
                          "highlight",
                          highlight
                        ],
                        /* [] */0
                      ]
                    ]),
                /* :: */[
                  offset !== 0 ? Tea_html.onClick(/* Jump */Block.__(1, [offset])) : Tea_html.noProp,
                  /* [] */0
                ]
              ], /* :: */[
                Tea_html.span(undefined, undefined, /* :: */[
                      Tea_html.class$prime("move"),
                      /* [] */0
                    ], /* :: */[
                      Tea_html.text("\u2302"),
                      /* [] */0
                    ]),
                /* [] */0
              ]);
  };
  var move_view = function ($staropt$star, ply$prime, offset, move) {
    var highlight = $staropt$star !== undefined ? $staropt$star : false;
    var ply = (ply$prime + offset | 0) + 1 | 0;
    var turn = ply % 2 === 0 ? /* White */1 : /* Black */0;
    var number = ply / 2 | 0;
    return Tea_html.li(undefined, undefined, /* :: */[
                Tea_html.classList(/* :: */[
                      /* tuple */[
                        "move",
                        true
                      ],
                      /* :: */[
                        /* tuple */[
                          "white",
                          turn === /* White */1
                        ],
                        /* :: */[
                          /* tuple */[
                            "black",
                            turn === /* Black */0
                          ],
                          /* :: */[
                            /* tuple */[
                              "highlight",
                              highlight
                            ],
                            /* [] */0
                          ]
                        ]
                      ]
                    ]),
                /* :: */[
                  offset !== 0 ? Tea_html.onClick(/* Jump */Block.__(1, [offset])) : Tea_html.noProp,
                  /* [] */0
                ]
              ], /* :: */[
                Tea_html.span(undefined, undefined, /* :: */[
                      Tea_html.class$prime("number"),
                      /* [] */0
                    ], /* :: */[
                      Tea_html.text(String(number)),
                      /* [] */0
                    ]),
                /* :: */[
                  Tea_html.span(undefined, undefined, /* :: */[
                        Tea_html.class$prime("move"),
                        /* [] */0
                      ], /* :: */[
                        Tea_html.text(move[/* san */1]),
                        /* [] */0
                      ]),
                  /* [] */0
                ]
              ]);
  };
  var move_list_future_view = function (ply, future) {
    var _offset = 1;
    var _cont = function (x) {
      return x;
    };
    var _param = future;
    while(true) {
      var param = _param;
      var cont = _cont;
      var offset = _offset;
      if (param) {
        var hd = param[0];
        _param = param[1];
        _cont = (function(offset,cont,hd){
        return function (acc) {
          return Curry._1(cont, /* :: */[
                      move_view(undefined, ply, offset, hd),
                      acc
                    ]);
        }
        }(offset,cont,hd));
        _offset = offset + 1 | 0;
        continue ;
      } else {
        return Curry._1(cont, /* [] */0);
      }
    };
  };
  var loop = function (_offset, _acc, _param) {
    while(true) {
      var param = _param;
      var acc = _acc;
      var offset = _offset;
      if (param) {
        _param = param[1];
        _acc = /* :: */[
          move_view(offset === 0, ply, offset, param[0]),
          acc
        ];
        _offset = offset - 1 | 0;
        continue ;
      } else {
        return acc;
      }
    };
  };
  return Tea_html.ul(undefined, undefined, /* :: */[
              Tea_html.class$prime("moves"),
              /* [] */0
            ], /* :: */[
              home_view(ply === 0, -ply | 0),
              loop(0, move_list_future_view(ply, param[1]), param[0])
            ]);
}

function status_view(position) {
  var match = Chess.game_status(position);
  var tmp;
  if (typeof match === "number") {
    tmp = "It's a draw!";
  } else if (match.tag) {
    var match$1 = position[/* turn */1];
    tmp = Curry._2(Printf.sprintf(/* Format */[
              /* String_literal */Block.__(11, [
                  "It is ",
                  /* String */Block.__(2, [
                      /* No_padding */0,
                      /* String_literal */Block.__(11, [
                          "'s move,  ",
                          /* Int */Block.__(4, [
                              /* Int_d */0,
                              /* No_padding */0,
                              /* No_precision */0,
                              /* String_literal */Block.__(11, [
                                  " legal moves",
                                  /* End_of_format */0
                                ])
                            ])
                        ])
                    ])
                ]),
              "It is %s's move,  %d legal moves"
            ]), match$1 ? "White" : "Black", List.length(match[0]));
  } else {
    tmp = match[0] ? "White wins by checkmate!" : "Black wins by checkmate!";
  }
  return Tea_html.p(undefined, undefined, /* [] */0, /* :: */[
              Tea_html.text(tmp),
              /* [] */0
            ]);
}

function view(model) {
  return Tea_html.div(undefined, undefined, /* [] */0, /* :: */[
              status_view(model[/* position */0]),
              /* :: */[
                move_list_view(model[/* position */0][/* number */9], model[/* moves */1]),
                /* [] */0
              ]
            ]);
}

var take_back = /* Take_back */0;

var forward = /* Forward */1;

export {
  move ,
  take_back ,
  forward ,
  init ,
  simple_move ,
  jump ,
  update ,
  move_list_view ,
  status_view ,
  view ,
  
}
/* Chess Not a pure module */
