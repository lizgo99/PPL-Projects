import {Exp, Program, isProgram, isBoolExp, isNumExp, isVarRef, isPrimOp, isProcExp, isIfExp, isAppExp, isDefineExp, isStrExp, PrimOp, CExp, AppExp, IfExp , ProcExp, DefineExp} from '../imp/L3-ast';
import { Result, makeFailure, makeOk } from '../shared/result';
import {map} from "ramda";
import {bind, mapResult, safe2 } from '../shared/result';

/*
Purpose: Transform L2 AST to Python program string
Signature: l2ToPython(l2AST)
Type: [Parsed | Error] => Result<string>
*/
export const l2ToPython = (exp: Exp | Program): Result<string>  => 
    isProgram(exp) ? proceedProgram(exp.exps) :
    isBoolExp(exp) ? makeOk(exp.val ? 'True' : 'False') :
    isNumExp(exp) ?  makeOk(exp.val.toString()) :
    isStrExp(exp) ? makeOk('"' + exp.val + '"') :
    isVarRef(exp) ? makeOk(exp.var) :
    isProcExp(exp) ? proceedProc(exp) :
    isIfExp(exp) ? proceedIf(exp.test, exp.then, exp.alt) :
    isAppExp(exp) ? proceedApp(exp) :
    isPrimOp(exp) ? proceedPrimOp(exp.op) :
    isDefineExp(exp) ? proceedDefine(exp) :
    makeFailure("");

export const proceedProgram = (exp: Exp[]): Result<string> => 
    bind(mapResult(l2ToPython, exp), exps => makeOk(exps.join("\n")));

export const proceedProc = (exp: ProcExp): Result<string> =>
    bind(l2ToPython(exp.body[0]), (body: string) => makeOk("(lambda " + map((param) => param.var, exp.args).join(",") + " : " + body + ")"));

export const proceedIf = (testExp: CExp , thenExp: CExp , altExp: CExp): Result<string> => 
    bind(
        l2ToPython(testExp),
        (test: string) =>
            bind(
                l2ToPython(thenExp),
                (then: string) =>
                    bind(
                        l2ToPython(altExp),
                        (alt: string) => makeOk(`(${then} if ${test} else ${alt})`)
                    )
            )
    );

export const proceedApp = (exp: AppExp): Result<string> => 
    isPrimOp(exp.rator) ? proceedAppPrim(exp.rator, exp.rands) :
        safe2((rator: string, rands: string[]) => makeOk(`${rator}(${rands.join(",")})`))
            (l2ToPython(exp.rator), mapResult(l2ToPython, exp.rands));

export const proceedAppPrim = (rator: PrimOp, rands: CExp[]): Result<string> => 
    (rator.op === "not") ? bind(l2ToPython(rands[0]), (rand : string) => makeOk(`(not ${rand})`)) :
    (rator.op === "number?") ? bind(l2ToPython(rands[0]), (rand : string) => makeOk(`(lambda x : (type(x) == int) or (type(x) == float))(${rand})`)) :
    (rator.op === "boolean?") ? bind(l2ToPython(rands[0]), (rand : string) => makeOk(`(lambda x : (type(x) == bool))(${rand})`)) :
    (rator.op === "eq?" || rator.op === "=" ) ? bind(mapResult(l2ToPython,rands), (rands) => makeOk("(" + rands.join(" == ") + ")")) :
    bind(mapResult(l2ToPython,rands), (rands) => makeOk("(" + rands.join(" " + rator.op + " ") + ")"));

export const proceedPrimOp = (primOp : string): Result<string> => 
    primOp === "number?" ? makeOk("(lambda x : (type(x) == int) or (type(x) == float))") :
    primOp === "boolean?" ? makeOk("(lambda x : (type(x) == bool))") :
    primOp === "eq?" || primOp === "=" ?  makeOk("==") : 
    makeOk(primOp);

export const proceedDefine = (exp: DefineExp): Result<string> => 
    bind(l2ToPython(exp.val), (val: string) => makeOk(`${exp.var.var} = ${val}`));





