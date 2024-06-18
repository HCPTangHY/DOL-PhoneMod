window.CharacterSchedule = {
    Robin: {
        getResponseMinute() {
            if (Time.hour >= 8 && Time.hour <= 9) {
                return 5;
            } else if (Time.hour >= 21) {
                return ((24 - Time.hour + 7) - 1) * 60 + 60 - Time.minute;
            } else if (Time.hour <= 7) {
                return ((7 - Time.hour) - 1) * 60 + 60 - Time.minute;
            } else if (Time.schoolDay && Time.hour >= 12 && Time.hour <= 13) {
                return 1;
            } else if (Time.hour >= 15) {
                return 5;
            } else if (!Time.schoolDay && Time.hour >= 9 && time.hour <= 16) {
                return 10;
            } else {
                return 5;
            }
        }
    },
    Bailey: {
        getResponseMinute() {
            return 2;
        }
    }
}
