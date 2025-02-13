/// <reference types="bn.js" />
import { BN } from 'avalanche';
export declare type UniversalTxActionExportC = 'export_c_x' | 'export_c_p';
export declare type UniversalTxActionImportC = 'import_x_c' | 'import_p_c';
export declare type UniversalTxActionExportX = 'export_x_p' | 'export_x_c';
export declare type UniversalTxActionImportX = 'import_p_x' | 'import_c_x';
export declare type UniversalTxActionExportP = 'export_p_x' | 'export_p_c';
export declare type UniversalTxActionImportP = 'import_x_p' | 'import_c_p';
export declare type UniversalTxActionExport = UniversalTxActionExportC | UniversalTxActionExportX | UniversalTxActionExportP;
export declare type UniversalTxActionImport = UniversalTxActionImportC | UniversalTxActionImportX | UniversalTxActionImportP;
export interface UniversalTxExport {
    action: UniversalTxActionExport;
    amount: BN;
    fee: BN;
}
export interface UniversalTxImport {
    action: UniversalTxActionImport;
    fee: BN;
}
declare type UniversalTxActionTypesX = UniversalTxActionExportX | UniversalTxActionImportX;
declare type UniversalTxActionTypesC = UniversalTxActionExportC | UniversalTxActionImportC;
declare type UniversalTxActionTypesP = UniversalTxActionExportP | UniversalTxActionImportP;
export declare type UniversalTxActionType = UniversalTxActionTypesX | UniversalTxActionTypesC | UniversalTxActionTypesP;
export declare type UniversalTx = UniversalTxsX | UniversalTxsP | UniversalTxsC;
declare type UniversalTxsX = UniversalTxExportX | UniversalTxImportX;
declare type UniversalTxsP = UniversalTxExportP | UniversalTxImportP;
declare type UniversalTxsC = UniversalTxExportC | UniversalTxImportC;
export interface UniversalTxExportC extends UniversalTxExport {
    action: UniversalTxActionExportC;
}
export interface UniversalTxExportX extends UniversalTxExport {
    action: UniversalTxActionExportX;
}
export interface UniversalTxExportP extends UniversalTxExport {
    action: UniversalTxActionExportP;
}
export interface UniversalTxImportC extends UniversalTxImport {
    action: UniversalTxActionImportC;
    fee: BN;
}
export interface UniversalTxImportX extends UniversalTxImport {
    action: UniversalTxActionImportX;
}
export interface UniversalTxImportP extends UniversalTxImport {
    action: UniversalTxActionImportP;
}
export {};
