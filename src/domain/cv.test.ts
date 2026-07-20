import { describe,expect,it } from "vitest";
import { defaultCv } from "@/data/default-cv";
import { validateCv } from "@/domain/cv";
describe("CV schema",()=>{it("accepts the canonical CV",()=>expect(validateCv(defaultCv).basics.name).toBe("Kostiantyn Mironchyk"));it("rejects invalid URLs",()=>expect(()=>validateCv({...defaultCv,basics:{...defaultCv.basics,links:[{label:"bad",url:"not a url"}]}})).toThrow())});
