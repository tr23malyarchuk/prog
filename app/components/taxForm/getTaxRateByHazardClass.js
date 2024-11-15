function getTaxRateByHazardClass(hazardClass) {
    if (hazardClass) {
        switch (parseInt(hazardClass, 10)) {
            case 1:
                return 18413.24; // Клас I
            case 2:
                return 4216.92; // Клас II
            case 3:
                return 628.32; // Клас III
            case 4:
                return 145.50; // Клас IV
            default:
                return 0; // Невідомий клас небезпеки
        }
    }

    return 0; // Якщо клас небезпеки не вказано
}
