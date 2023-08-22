import {  Exp, Program, isProgram, makeIfExp, makeProgram , CondExp, IfExp , isCondExp , isExp, CondClause, makeCondExp, isAtomicExp, isIfExp , isLitExp , isAppExp , isProcExp , isLetExp , makeAppExp, makeProcExp, makeLetExp, makeDefineExp , CExp, isCExp, isDefineExp } from "./L31-ast";
import { Result, makeFailure, makeOk, bind, mapResult } from "../shared/result";
import { first, rest } from "../shared/list";
import { map } from "ramda";


/*
Purpose: Transform L31 AST to L3 AST
Signature: l31ToL3(l31AST)
Type: [Exp | Program] => Result<Exp | Program>
*/
export const L31ToL3 = (exp: Exp | Program): Result<Exp | Program> => {
    if (isExp(exp)) {
        return makeOk(rewriteAllCondExp(exp));
    } else if (isProgram(exp)) {
        const rewrittenExps = map(rewriteAllCondExp, exp.exps);
        return makeOk(makeProgram(rewrittenExps));
    } else {
        return makeFailure("Not a valid L31 AST");
    }
};

export const rewriteAllCondExp = (exp: Exp): Exp =>
    isCExp(exp) ? rewriteAllCondCExp(exp) :
    isDefineExp(exp) ? makeDefineExp(exp.var, rewriteAllCondCExp(exp.val)) :
    exp;


export const rewriteAllCondCExp = (exp: CExp): CExp =>
    isAtomicExp(exp) ? exp :
    isLitExp(exp) ? exp :
    isIfExp(exp) ? makeIfExp(rewriteAllCondCExp(exp.test),
    rewriteAllCondCExp(exp.then),
    rewriteAllCondCExp(exp.alt)) :
    isAppExp(exp) ? makeAppExp(rewriteAllCondCExp(exp.rator),
                                map(rewriteAllCondCExp, exp.rands)) :
    isProcExp(exp) ? makeProcExp(exp.args, map(rewriteAllCondCExp, exp.body)) :
    isLetExp(exp) ? makeLetExp(exp.bindings, map(rewriteAllCondCExp, exp.body)) :
    isCondExp(exp) ? rewriteAllCondCExp(rewriteCond(exp)):
    exp;


export const rewriteCond = (condExp: CondExp): IfExp => {
    const condClauses = condExp.condClauses;
    const elseClause = condExp.elseClause;

    if (condClauses.length === 1) {
        return makeIfExp(first(condClauses).test, first(condClauses).then, elseClause.alt);
    } else {
        return makeIfExp(first(condClauses).test, first(condClauses).then, rewriteCond(makeCondExp(rest(condClauses), elseClause)));
    }
}