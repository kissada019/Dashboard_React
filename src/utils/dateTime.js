import moment from 'moment';

/* @changeFormatDate
    'DD/MM/YYYY', 'DD/MM/YYYY HH:mm:ss',  'DD-MM-YYYY', 'DD-MM-YYYY HH:mm:ss'
    'YYYY/MM/DD', 'YYYY/MM/DD HH:mm:ss',  'YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss'
 */
const changeFormatDisPlayDate = (dateTime, format, lang = 'en') => {
    let display = '';
    try {
        if (dateTime) {
            // console.log('changeFormatDate : ', dateTime);
            moment.locale(lang);
            let splitDateTime = dateTime.split(/[ T\s]/);
            let date = splitDateTime[0].replace(/\//g, '-');
            let year = date.split('-')[0].length === 4 ? date.split('-')[0] : date.split('-')[2];
            let month = date.split('-')[1];
            let day = date.split('-')[0].length === 4 ? date.split('-')[2] : date.split('-')[0];
            let momentDate = year + '-' + month + '-' + day;

            if (lang.toLowerCase() === 'th') {
                momentDate = momentDate.replace(year, (parseInt(year) + 543))
            }

            if (splitDateTime.length === 1) { /* Format Date */
                display = moment(momentDate).format(format);
            }
            else { /* Format DateTime */
                display = moment(momentDate + ' ' + splitDateTime[1]).format(format);
            }
        }
    } catch (error) {
        console.log('displayDate : ', error);
        display = dateTime;
    }

    return display;
}

const changeFormatDisPlayDateCustomFormat = (dateTime, fromFormat, toFormat, lang = 'th') => {
    let display = '';
    try {
        if (dateTime) {
            console.log('changeFormatDisPlayDateCustomFormat : ', dateTime);
            moment.locale(lang);

            if (lang.toLowerCase() === 'th') {
                let year = dateTime.split(/[/-\s]/).find(v => v.length === 4);
                dateTime = dateTime.replace(year, (parseInt(year) + 543))
            }

            display = moment(dateTime, fromFormat).format(toFormat);
        }
    } catch (error) {
        console.log('displayDate : ', error);
        display = dateTime;
    }

    return display;
}

const displayDate = (dateTime, format, lang = 'en') => {
    let display = '';
    try {
        if (dateTime) {
            // console.log("displayDate dateTime : ", dateTime)
            moment.locale(lang);
            let arrDateTime = dateTime.split(' ');
            let date = arrDateTime[0].includes('/') ? arrDateTime[0].replace(/\//g, '-') : arrDateTime[0];
            let year = date.split('-')[0].length === 4 ? date.split('-')[0] : date.split('-')[2];
            let month = date.split('-')[1];
            let day = date.split('-')[0].length === 4 ? date.split('-')[2] : date.split('-')[0];
            let full = year + '-' + month + '-' + day;
            if (lang && lang.toUpperCase() === 'TH') {
                full = full.replace(year, (parseInt(year) + 543));
            }
            // console.log("displayDate full : ", full)
            if (arrDateTime.length === 1) {
                display = moment(full).format(format);
            }
            else {
                display = moment(full + ' ' + arrDateTime[1]).format(format);
            }
        }
    } catch (error) {
        console.log('displayDate : ', error);
        display = dateTime;
    }

    return display;
}

const relativeTime = (dateTime, lang = "th") => {
    let display = '';
    try {
        if (dateTime) {
            moment.locale(lang);
            display = moment(dateTime).fromNow();
        }
    } catch (error) {
        console.log('relativeTime : ', error);
        display = dateTime;
    }

    return display;
}

const yearOptions = () => {
    let options = [];
    // for (let i = 1; i <= 12; i++) {
    // let year = moment().format('YYYY');
    options.push({
        value: moment().format('YYYY'),
        label: moment().format('YYYY')
    });
    //  }
    return options;
}

const preYearOptions = () => {
    let options = [];
    let nowYear = new Date().getFullYear()
    for (let i = nowYear; i >= 2000; i--) {
        // let year = moment().format('YYYY');
        options.push({
            value: i,
            label: i
        });
    }
    return options;
}

const monthOptions = (lang = 'th') => {
    let options = [];
    if (lang) {
        moment.locale(lang);
    }
    for (let i = 1; i <= 12; i++) {
        let year = moment().format('YYYY');
        options.push({
            value: moment(`${i}/${year}`, 'MM').format('MM'),
            label: moment(`${i}/${year}`, 'MM').format('MMMM')
        });
    }
    return options;
}

const monthYearOptions = () => {
    let options = [];
    for (let i = 1; i <= 12; i++) {
        let year = moment().format('YYYY');
        options.push({
            value: moment(`${i}/${year}`, 'MM/YYYY').format('MM/YYYY'),
            label: moment(`${i}/${year}`, 'MM/YYYY').format('MM/YYYY')
        });
    }
    return options;
}

const calculateManHour = (startDateTime, endDateTime, dateOf = [], dayOf = ['0', '6']) => {
    // console.log("calculateManHour ")
    let result = 0;
    try {
        /* รับ parameter */
        let startDate = changeFormatDisPlayDate(startDateTime, 'DD/MM/YYYY HH:mm');
        let endDate = changeFormatDisPlayDate(endDateTime, 'DD/MM/YYYY HH:mm');
        let firtDateTime = moment(startDate, 'DD/MM/YYYY HH:mm');
        let firtDateTimeAtStartTime = moment(startDate.split(" ")[0] + " 08:30", 'DD/MM/YYYY HH:mm');
        let firtDateTimeAtEndTime = moment(startDate.split(" ")[0] + " 12:00", 'DD/MM/YYYY HH:mm');
        let firtDateTimeAtAfterEndTime = moment(startDate.split(" ")[0] + " 13:00", 'DD/MM/YYYY HH:mm');
        let lastDateTime = moment(endDate, 'DD/MM/YYYY HH:mm');
        let lastDateTimeAtBeforeStartTime = moment(endDate.split(" ")[0] + " 12:00", 'DD/MM/YYYY HH:mm');
        let lastDateTimeAtStartTime = moment(endDate.split(" ")[0] + " 13:00", 'DD/MM/YYYY HH:mm');
        let lastDateTimeAtEndTime = moment(endDate.split(" ")[0] + " 17:30", 'DD/MM/YYYY HH:mm');

        /* หาจำนวนวัน startDateTime กับ endDateTime */
        let countDay = lastDateTime.diff(firtDateTime, 'days');

        /* หาจำนวนวันหยุดระหว่าง startDateTime กับ endDateTime */
        let countDayOf = 0;
        let countDateOf = 0;
        for (var m = moment(firtDateTime); m.isBefore(lastDateTime); m.add(1, 'days')) {
            if (dateOf.filter(f => changeFormatDisPlayDate(f.holidayDate, 'DD/MM/YYYY') === m.format('DD/MM/YYYY')).length > 0) {
                countDateOf = countDateOf + 1;
            }
            if (dayOf.includes(m.format('d'))) {
                countDayOf = countDayOf + 1;
            }
        }

        /* summary จำนวนวันทั้งหมด */
        let sumCount = (parseFloat(countDay) + 1) - (parseFloat(countDayOf) + parseFloat(countDateOf));

        /* หาจำนวนนาทีในแต่ละวัน (480 น. = 8 ชม.) */
        let minuteDate = 480 * parseFloat(sumCount);

        /* หาจำนวนนาที ระหว่างเวลา 08:30 น. ถึง เวลาของ startDateTime */
        let minuteStartDate = 0;
        if (dateOf.filter(f => changeFormatDisPlayDate(f.holidayDate, 'DD/MM/YYYY') === firtDateTime.format('DD/MM/YYYY')).length === 0) {
            if (dayOf.includes(firtDateTime.format('d')) === false) {
                /* ตรวจสอบเวลา เกิน 08:30 หรือไม่ */
                if (firtDateTime.isAfter(firtDateTimeAtStartTime)) {
                    minuteStartDate = firtDateTime.diff(firtDateTimeAtStartTime, 'minutes');
                    /* ตรวจสอบเวลาเกิน 12:00 หรือไม่ */
                    if (firtDateTime.isAfter(firtDateTimeAtEndTime)) {
                        /* ตรวจสอบเวลาเกิน 13:00 หรือไม่ */
                        if (firtDateTime.isAfter(firtDateTimeAtAfterEndTime)) {
                            minuteStartDate = parseFloat(minuteStartDate) - 60;
                        }
                        else {
                            let minuteStartDateAtEndTime = firtDateTime.diff(firtDateTimeAtEndTime, 'minutes');
                            minuteStartDate = parseFloat(minuteStartDate) - parseFloat(minuteStartDateAtEndTime);
                        }
                    }
                }
            }
        }

        /* หาจำนวนนาที ระหว่างเวลา lastDateTime ถึง เวลา 17:30 น. */
        let minuteEndDate = 0;
        if (dateOf.filter(f => changeFormatDisPlayDate(f.holidayDate, 'DD/MM/YYYY') === lastDateTime.format('DD/MM/YYYY')).length === 0) {
            if (dayOf.includes(lastDateTime.format('d')) === false) {
                /* ตรวจสอบเวลา น้อยกว่า 17:30 หรือไม่ */
                if (lastDateTime.isBefore(lastDateTimeAtEndTime)) {
                    minuteEndDate = lastDateTimeAtEndTime.diff(lastDateTime, 'minutes');
                    /* ตรวจสอบเวลา น้อยกว่า 13:00 และน้อยกว่า 12:00 หรือไม่ */
                    if (lastDateTime.isBefore(lastDateTimeAtStartTime)) {
                        /* ตรวจสอบเวลา น้อยกว่า 12:00 หรือไม่ */
                        if (lastDateTime.isBefore(lastDateTimeAtBeforeStartTime)) {
                            minuteEndDate = parseFloat(minuteEndDate) - 60;
                        }
                        else {
                            let minuteEndDateAtStartTime = lastDateTimeAtStartTime.diff(lastDateTime, 'minutes');
                            minuteEndDate = parseFloat(minuteEndDate) - parseFloat(minuteEndDateAtStartTime);
                        }
                    }
                }
            }
        }

        /* summary จำนวนนาทีทั้งหมด */
        let sumMinute = parseFloat(minuteDate) - (parseFloat(minuteStartDate) + parseFloat(minuteEndDate));

        /* แปลงนาที่เป็น ชม. */
        result = moment.duration(sumMinute, 'minutes').asHours().toFixed(2);
    } catch (error) {
        console.log('displayDate : ', error);
        result = 0;
    }
    return result;
}

const calculateManDay = (startDate, endDate, dateOf = [], dayOf = ['0', '6']) => {
    // console.log("calculateManHour ")
    let result = 0;
    try {
        /* รับ parameter */
        let start = changeFormatDisPlayDate(startDate, 'DD/MM/YYYY HH:mm');
        let end = changeFormatDisPlayDate(endDate, 'DD/MM/YYYY HH:mm');
        let firtDateTime = moment(start, 'DD/MM/YYYY HH:mm');
        let lastDateTime = moment(end, 'DD/MM/YYYY HH:mm');

        /* หาจำนวนวัน startDateTime กับ endDateTime */
        let countDay = lastDateTime.diff(firtDateTime, 'days');

        /* หาจำนวนวันหยุดระหว่าง startDateTime กับ endDateTime */
        let countDayOf = 0;
        let countDateOf = 0;
        for (var m = moment(firtDateTime); m.isBefore(lastDateTime); m.add(1, 'days')) {
            if (dateOf.filter(f => changeFormatDisPlayDate(f.holidayDate, 'DD/MM/YYYY') === m.format('DD/MM/YYYY')).length > 0) {
                countDateOf = countDateOf + 1;
            }
            if (dayOf.includes(m.format('d'))) {
                countDayOf = countDayOf + 1;
            }
        }

        /* summary จำนวนวันทั้งหมด */
        result = (parseFloat(countDay) + 1) - (parseFloat(countDayOf) + parseFloat(countDateOf));

    } catch (error) {
        console.log('displayDate : ', error);
        result = 0;
    }
    return result;
}

const dateTime = {
    changeFormatDisPlayDate: changeFormatDisPlayDate,
    changeFormatDisPlayDateCustomFormat: changeFormatDisPlayDateCustomFormat,
    displayDate: displayDate,
    relativeTime: relativeTime,
    yearOptions: yearOptions,
    preYearOptions: preYearOptions,
    monthOptions: monthOptions,
    monthYearOptions: monthYearOptions,
    calculateManHour: calculateManHour,
    calculateManDay: calculateManDay,
}

export default dateTime;