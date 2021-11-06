// types ---------------------------------------------------------------------

// Typescript type definitions for client application components.

// External Modules ----------------------------------------------------------

import React from "react";

// Internal Modules ----------------------------------------------------------

import Category from "./models/Category";
import Detail from "./models/Detail";
import Facility from "./models/Facility";
import Section from "./models/Section";
import User from "./models/User";

// Enumerations --------------------------------------------------------------

// Logging levels
export enum Level {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
}

// OAuth scopes
export enum Scope {
    ADMIN = "admin",
    ANY = "any",
    REGULAR = "regular",
    SUPERUSER = "superuser",
}

// HTML Event Handlers -------------------------------------------------------

export type OnAction = () => void; // Nothing to pass, just trigger action
export type OnBlur = (event: React.FocusEvent<HTMLElement>) => void;
export type OnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type OnChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => void;
export type OnChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type OnClick = (event: React.MouseEvent<HTMLElement>) => void;
export type OnFocus = (event: React.FocusEvent<HTMLElement>) => void;
export type OnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => void;

// Miscellaneous Handlers ----------------------------------------------------

export type HandleAction = () => void; // Synonym for OnAction
export type HandleBoolean = (newBoolean: boolean) => void;
export type HandleDate = (date: string) => void;
export type HandleIndex = (newIndex: number) => void;
export type HandleMonth = (month: string) => void;
export type HandleResults = () => Promise<object>;
export type HandleValue = (newValue: string) => void;

// Model Object Handlers -----------------------------------------------------

export type HandleCategory = (category: Category) => void;
export type HandleDetail = (detail: Detail) => void;
export type HandleFacility = (facility: Facility) => void;
export type HandleSection = (section: Section) => void;
export type HandleUser = (user: User) => void;