import $ from "jquery";
import can from "can";
import "components/app/app";



$(document.body).append( can.stache("<app-container/>")() );
