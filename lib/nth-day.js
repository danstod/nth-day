'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.nthDay = nthDay;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dateFromDate(date) {
  if (!date) {
    return (0, _moment2.default)();
  }

  if (typeof date === 'string') {
    var dateObj = new Date(date);
    if (dateObj.toString() === 'Invalid Date') {
      // console.log('Invalid Date:', date);
      throw date;
    }
    return (0, _moment2.default)(dateObj);
  }

  if ((typeof date === 'undefined' ? 'undefined' : _typeof(date)) === 'object') {
    if (_moment2.default.isMoment(date)) {
      return date;
    }
    return (0, _moment2.default)(date);
  }

  throw new Error('Do not know how to handle this type:', typeof date === 'undefined' ? 'undefined' : _typeof(date));
}

function dayFromString(dayOfWeek) {
  if (typeof dayOfWeek === 'string') {
    var dow = dayOfWeek.toLowerCase().slice(0, 3);
    var weekDays = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    var dayNumber = weekDays.indexOf(dow);
    if (dayNumber === -1) {
      throw new Error('Do not recognize this day: ', dayOfWeek);
    }
    return dayNumber;
  }
  if (typeof dayOfWeek !== 'number') {
    throw new Error('Expecting dayOfWeek to be a number or string but it was: ', typeof dayOfWeek === 'undefined' ? 'undefined' : _typeof(dayOfWeek));
  }
  if (dayOfWeek < 0 || dayOfWeek > 6) {
    throw new Error('Expecting dayOfWeek to be in the range of 0 to 6 but it was ', dayOfWeek);
  }
  return dayOfWeek;
}

// nth - value from 1 through 5 for the (say) 4th Friday
//   Negative numbers count backwards from the end of the month
//   (For example, the last Friday, or the second to last Sunday)
// dayOfWeek - 0 through 6 (Sun through Sat) or can be string (e.g. 'monday')
// relevantDate - a date as a string or Date object or moment object
// Returns a moment date
// eslint-disable-next-line import/prefer-default-export
function nthDay(nth, dayOfWeek, relevantDateParam, afterDayParam) {
  var relevantDate = dateFromDate(relevantDateParam);
  var month = relevantDate.month();
  var year = relevantDate.year();
  var afterDay = afterDayParam || 0;

  if (nth < 0) {
    // nth-last day of the month
    var fourthDay = nthDay(4, dayOfWeek, relevantDate);
    var occurrences = void 0;

    if (fourthDay.add(1, 'week').month() > month) {
      // It's a month with four of this day of the week
      occurrences = 4;
    } else {
      // It's a month with five of this day of the week
      occurrences = 5;
    }
    return nthDay(occurrences + 1 + nth, dayOfWeek, relevantDate, afterDay);
  }

  var dow = dayFromString(dayOfWeek);

  var counter = nth - 1;
  var day = counter * 7 + 1 + afterDay;

  var date = (0, _moment2.default)([year, month, day]);
  date.subtract(1, 'day');
  while (counter !== nth) {
    date.add(1, 'day');
    if (date.day() === dow) {
      counter += 1;
    }
  }
  return date;
}