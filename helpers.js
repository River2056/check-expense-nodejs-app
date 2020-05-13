const fs = require('fs');

const helpers = {
    getDateStrArray: timeStr => {
        const year = timeStr.substring(0, 4);
        const month = timeStr.substring(4, 6);
        const day = timeStr.substring(6);
        return [year, month, day];
    },
    getNextDateOfMonth: timeStr => {
        const year = timeStr.substring(0, 4);
        const month = timeStr.substring(4, 6);

        let nextMonth = parseInt(month) + 1;
        if(nextMonth > 12) {
            nextMonth = '01';
            const nextYear = parseInt(year) + 1;
            return [nextYear.toString(), nextMonth, '10'];
        }
        return [year, nextMonth.toString(), '10'];
    },
    getAllExpense: () => {
        const fileContents = fs.readFileSync('expenses.txt', 'utf8')
        let total = 0;
        const fileArr = fileContents.split('\n').filter(line => !line.startsWith('//'));
        fileArr.forEach(line => {
            const expDetl = line.split('=');
            total += parseInt(expDetl[1]);
        })
        return [total, fileArr];
    }
}

module.exports = helpers;