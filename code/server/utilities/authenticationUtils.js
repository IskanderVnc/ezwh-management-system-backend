'use strict';

// This is our utils file only to test the authentications while we still don't have the sessions part.

//TODO: reset this two lines!!!
let sessionType = "manager";
let username = "manager1@ezwh.com";

exports.setSessionType = (type) => {
  sessionType = type;
}

exports.getSessionType = () => {
  return sessionType;
}

exports.setUsername = (email) => {
  username = email;
}

exports.getUsername = () => {
  return username;
}