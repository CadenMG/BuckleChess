include Ochess

type file = int
type rank = int
type square = file * rank

let home_rank = function White -> 0 | Black -> 7
let promotion_rank = function White -> 7 | Black -> 0
let pre_promotion_rank = function White -> 6 | Black -> 1

let coordinate_pairs turn = function
  | Queenside_castle -> (4, home_rank turn), (2, home_rank turn)
  | Kingside_castle -> (4, home_rank turn), (6, home_rank turn)
  | Promotion (_piece_type, s_file, t_file) ->
    (s_file, pre_promotion_rank turn), (t_file, promotion_rank turn)
  | Move (s_file, s_rank, t_file, t_rank) ->
    (s_file, s_rank), (t_file, t_rank)

let string_of_piece_type = function
  | King -> "king"
  | Queen -> "queen"
  | Rook -> "rook"
  | Bishop -> "bishop"
  | Knight -> "knight"
  | Pawn -> "pawn"

let string_of_color = function
  | White -> "white"
  | Black -> "black"

type capture = bool
type promotion = piece_type option

type short_move =
  piece_type * file option * rank option * square * capture

type long_move =
  | Piece_move of piece_type * square * square * capture
  | Pawn_move of file * square * capture * promotion
  | Ochess_move of move

type check =
  | Check | Checkmate | No_check

let make_move' position move =
  make_move position move 0

let char_of_file file = "abcdefgh".[file]
let char_of_rank rank = "12345678".[rank]

let check_or_checkmate position move =
  let position' = make_move' position move in
  let checked = king_checked position' position'.turn in
  if checked then
    match legal_moves position' with
    | [] -> Checkmate
    | _ -> Check
  else No_check

let long_move position move =
  match move with
  | Move (s_file, s_rank, t_file, t_rank) ->
    begin match position.ar.(s_file).(s_rank) with
      | Piece (Pawn, _) ->
        (* a pawn move is a capture if and only if it changes files *)
        Pawn_move (s_file, (t_file, t_rank), (s_file <> t_file), None)
      | Piece (p_type, _) ->
        let capture =
          match position.ar.(t_file).(t_rank) with
          | Piece _ -> true | Empty -> false in
        Piece_move (p_type, (s_file, s_rank), (t_file, t_rank), capture)
      | Empty -> raise Illegal_move
    end
  | Queenside_castle -> Ochess_move Queenside_castle
  | Kingside_castle -> Ochess_move Kingside_castle
  | Promotion (p_type, s_file, t_file) ->
    let t_rank =
      match position.turn with
      | White -> 7 | Black -> 0 in
    Pawn_move (s_file, (t_file, t_rank), (s_file <> t_file), Some p_type)

let unify value hint =
  match value, hint with
  | _, None -> true (* everything unifies with None *)
  | x, Some y when x = y -> true
  | _ -> false

(* is the candidate a possible short form of a long move? *)
let unify_move short_move long_move =
  match long_move with
  | Piece_move (long_p_type, long_source, long_target, _) ->
    (* capture irrelevant *)
    let long_file, long_rank = long_source in
    let short_p_type, short_file_hint, short_rank_hint, short_target, _
      = short_move in
    short_target = long_target &&
    short_p_type = long_p_type &&
    unify long_file short_file_hint &&
    unify long_rank short_rank_hint
  | _ -> false (* we can safely ignore pawn moves and castling *)

let unique move_list short_move =
  List.filter (unify_move short_move) move_list |> List.length = 1

(* return a short move for a piece move, else None *)
(* following order of preference: Qg7, Qhg7, Q8g7, Qh8g7 *)
let short_move_of_long_move move_list long_move =
  let unique' = unique move_list in
  match long_move with
  | Piece_move (p_type, (s_file, s_rank), target, capture) ->
    let qg7 = (p_type, None, None, target, capture)
    in if unique' qg7 then Some qg7 else
      let qhg7 = (p_type, Some s_file, None, target, capture)
      in if unique' qhg7 then Some qhg7 else
        let q8g7 = (p_type, None, Some s_rank, target, capture)
        in if unique' q8g7 then Some q8g7 else (* Qh8g7 *)
          Some (p_type, Some s_file, Some s_rank, target, capture)
  | _ -> None

let san_of_move' position move_list move =
  let long_move = long_move position move
  and check = check_or_checkmate position move in
  let short_move_option = short_move_of_long_move move_list long_move in
  let san =
    match short_move_option, long_move with
    | None, Ochess_move Queenside_castle -> "O-O-O"
    | None, Ochess_move Kingside_castle -> "O-O"
    | None, Pawn_move (file, (t_file, t_rank), capture, promotion) ->
      Printf.sprintf "%s%c%c%s"
        (if capture then char_of_file file |> Printf.sprintf "%cx" else "")
        (char_of_file t_file)
        (char_of_rank t_rank)
        (match promotion with
         | None -> ""
         | Some p_type -> char_of_piece_type p_type |> Printf.sprintf "=%c")
    | Some (p_type, file_hint, rank_hint, (t_file, t_rank), capture), _ ->
      Printf.sprintf "%c%s%s%s%c%c"
        (char_of_piece_type p_type)
        (match file_hint with
         | None -> ""
         | Some file -> char_of_file file |> Printf.sprintf "%c")
        (match rank_hint with
         | None -> ""
         | Some rank -> char_of_rank rank |> Printf.sprintf "%c")
        (if capture then "x" else "")
        (char_of_file t_file)
        (char_of_rank t_rank)
    | _ -> raise Illegal_move
  in
  san ^ match check with
  | Check -> "+"
  | Checkmate -> "#"
  | No_check -> ""

let moves_assoc_list position moves =
  let long_moves = moves |> List.map (long_move position) in
  let san_moves = moves |> List.map (san_of_move' position long_moves) in
  List.combine moves san_moves

let legal_moves_with_san position =
  legal_moves position |> moves_assoc_list position

let san_of_move position move =
  let move_list = legal_moves position |> List.map (long_move position) in
  san_of_move' position move_list move
