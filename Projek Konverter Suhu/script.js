const converterForm = document.getElementById("converterForm");
if (converterForm) {
    const temperatureInput = document.getElementById("temperature");
    const fromUnit = document.getElementById("fromUnit");
    const toUnit = document.getElementById("toUnit");
    // DOM: mengambil hasil konversi
    const resultCard = document.getElementById("resultCard");
    const resultMessage = document.getElementById("resultMessage");
    const resultValue = document.getElementById("resultValue");
    const errorMessage = document.getElementById("errorMessage");
    const resetButton = document.getElementById("resetButton");
    const deleteButton = document.getElementById("deleteButton");

    const unitNames = {
        C: "Celsius",
        F: "Fahrenheit",
        K: "Kelvin",
        R: "Reamur"
    };
    const unitSymbols = {
        C: "°C",
        F: "°F",
        K: "K",
        R: "°Ré"
    };

    function toCelsius(value, unit) {
        switch (unit) {
            case "C":
                return value;

            case "F":
                return (value - 32) * 5 / 9;

            case "K":
                return value - 273.15;

            case "R":
                return value * 5 / 4;

            default:
                return value;
        }
    }
    // Mengubah satuan
    function fromCelsius(value, unit) {
        switch (unit) {
            case "C":
                return value;

            case "F":
                return (value * 9 / 5) + 32;

            case "K":
                return value + 273.15;

            case "R":
                return value * 4 / 5;

            default:
                return value;
        }
    }

    // Menghapus tampilan hasil
    function clearResult() {
        resultCard.hidden = true;
        resultMessage.textContent = "";
        resultValue.textContent = "";
    }
    // Proses konversi
    converterForm.addEventListener("submit", function (event) {
        event.preventDefault();
        //DOM: mengambil input suhu
        const temperature = Number(temperatureInput.value);
        // DOM:Mengambil pilihan satuan
        const sourceUnit = fromUnit.value;
        // DOM:Mengambil satuan tujuan
        const targetUnit = toUnit.value;

        errorMessage.textContent = "";
        clearResult();

        if (
            temperatureInput.value.trim() === "" ||
            !Number.isFinite(temperature)
        ) {
            errorMessage.textContent =
                "Masukkan nilai suhu yang valid.";
            return;
        }
        const celsiusValue = toCelsius(temperature, sourceUnit);

        // Memeriksa batas suhu nol mutlak
        if (celsiusValue < -273.15 - 1e-10) {
            errorMessage.textContent =
                "Suhu tidak boleh lebih rendah dari nol mutlak.";
            return;
        }
        const convertedValue = fromCelsius(
            celsiusValue,
            targetUnit
        );
        const roundedValue = Number(convertedValue.toFixed(4));

        // Menampilkan hasil pada halaman
        resultMessage.textContent =
            `${temperature} ${unitSymbols[sourceUnit]} ` +
            `${unitNames[sourceUnit]} sama dengan`;

        resultValue.textContent =
            `${roundedValue} ${unitSymbols[targetUnit]}`;
        resultCard.hidden = false;

        resultCard.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
    //  Konversi Lagi
    resetButton.addEventListener("click", function () {
        converterForm.reset();

        errorMessage.textContent = "";
        clearResult();

        temperatureInput.focus();

        converterForm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
    // Tombol Hapus Hasil
    deleteButton.addEventListener("click", function () {
        clearResult();
        errorMessage.textContent = "";
    });
}