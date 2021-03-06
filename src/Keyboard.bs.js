// Generated by BUCKLESCRIPT VERSION 4.0.6, PLEASE EDIT WITH CARE

import * as Vdom from "bucklescript-tea/src-ocaml/vdom.js";
import * as Block from "bs-platform/lib/es6/block.js";
import * as Curry from "bs-platform/lib/es6/curry.js";
import * as Tea_sub from "bucklescript-tea/src-ocaml/tea_sub.js";
import * as Tea_json from "bucklescript-tea/src-ocaml/tea_json.js";
import * as Js_primitive from "bs-platform/lib/es6/js_primitive.js";

var key_event = Tea_json.Decoder[/* map5 */20]((function (key_code, shift, ctrl, alt, meta) {
        return /* record */[
                /* key_code */key_code,
                /* shift */shift,
                /* ctrl */ctrl,
                /* alt */alt,
                /* meta */meta
              ];
      }), Tea_json.Decoder[/* field */11]("keyCode", Tea_json.Decoder[/* int */3]), Tea_json.Decoder[/* field */11]("shiftKey", Tea_json.Decoder[/* bool */5]), Tea_json.Decoder[/* field */11]("ctrlKey", Tea_json.Decoder[/* bool */5]), Tea_json.Decoder[/* field */11]("altKey", Tea_json.Decoder[/* bool */5]), Tea_json.Decoder[/* field */11]("metaKey", Tea_json.Decoder[/* bool */5]));

function registerGlobal(name, key, tagger) {
  var enableCall = function (callbacks_base) {
    var callbacks = /* record */[/* contents */callbacks_base];
    var fn = function (ev) {
      var match = Tea_json.Decoder[/* decodeEvent */31](key_event, ev);
      if (match.tag) {
        return undefined;
      } else {
        return Js_primitive.some(Curry._1(tagger, match[0]));
      }
    };
    var handler = /* EventHandlerCallback */Block.__(0, [
        key,
        fn
      ]);
    var elem = document;
    var cache = Vdom.eventHandler_Register(callbacks, elem, name, handler);
    return (function () {
        Vdom.eventHandler_Unregister(elem, name, cache);
        return /* () */0;
      });
  };
  return Tea_sub.registration(key, enableCall);
}

function downs($staropt$star, tagger) {
  var key = $staropt$star !== undefined ? $staropt$star : "";
  return registerGlobal("keydown", key, tagger);
}

export {
  key_event ,
  registerGlobal ,
  downs ,
  
}
/* key_event Not a pure module */
