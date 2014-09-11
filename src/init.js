import can from "can";
import "components/app/app";



can.append( can.$(document.body), can.stache("<app-container/>")() );
