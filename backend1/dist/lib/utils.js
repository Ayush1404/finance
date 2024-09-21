"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePercentageChange = calculatePercentageChange;
exports.fillMissingDates = fillMissingDates;
const date_fns_1 = require("date-fns");
function calculatePercentageChange(current, previous) {
    if (previous === 0) {
        return previous === current ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
}
function fillMissingDates(activeDays, startDate, endDate) {
    if (activeDays.length === 0)
        return [];
    const allDays = (0, date_fns_1.eachDayOfInterval)({
        start: startDate,
        end: endDate
    });
    const newActiveDays = allDays.map((date) => {
        const found = activeDays.find((day) => (0, date_fns_1.isSameDay)(day.date, date));
        if (found)
            return found;
        return {
            date,
            income: 0,
            expenses: 0
        };
    });
    return newActiveDays;
}
