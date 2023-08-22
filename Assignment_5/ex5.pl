/*
 * **********************************************
 * Printing result depth
 *
 * You can enlarge it, if needed.
 * **********************************************
 */
% maximum_printing_depth(100).

:- current_prolog_flag(toplevel_print_options, A),
    (select(max_depth(_), A, B), ! ; A = B),
    maximum_printing_depth(MPD),
    set_prolog_flag(toplevel_print_options, [max_depth(MPD)|B]).

% Signature: sub_list(Sublist, List)/2
% Purpose: All elements in Sublist appear in List in the same order.
% Precondition: List is fully instantiated (queries do not include variables in their second argument).
sub_list([],_). 
sub_list([H|T],[H|T1]):- sub_list(T,T1).
sub_list(S,[_|L]):- sub_list(S,L).


% Signature: sub_tree(Subtree, Tree)/2
% Purpose: Tree contains Subtree.

sub_tree(tree(X,LT,RT),tree(X,LT,RT)).
sub_tree(T,tree(_,LT,_)):- sub_tree(T,LT).
sub_tree(T,tree(_,_,RT)):- sub_tree(T,RT).


% Signature: swap_tree(Tree, InversedTree)/2
% Purpose: InversedTree is the 'mirror' representation of Tree.
swap_tree(void,void).
swap_tree(tree(X,LT1,RT1),tree(X,LT2,RT2)):- swap_tree(LT1,RT2), swap_tree(RT1,LT2).
