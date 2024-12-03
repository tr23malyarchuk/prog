function calculateCancerRisk() {
    const Ca = parseFloat(document.getElementById('conc-outside').value); // Концентрація речовини
    const Tout = parseFloat(document.getElementById('time-outside').value); // Час поза приміщенням
    const Tin = parseFloat(document.getElementById('time-inside').value); // Час у приміщенні
    const Vout = parseFloat(document.getElementById('vent-outside').value); // Швидкість дихання поза приміщенням
    const EF = parseFloat(document.getElementById('frequency').value); // Частота впливу
    const ED = parseFloat(document.getElementById('exposure-duration').value); // Тривалість впливу
    const BW = parseFloat(document.getElementById('body-weight').value); // Маса тіла
    const AT = parseFloat(document.getElementById('average-time').value); // Період осереднення експозиції
    const SF = parseFloat(document.getElementById('cancer-sf').value); // Фактор канцерогенного потенціалу

    // Формула для розрахунку середньої добової дози (LADD)
    const LADD = ((Ca * Tout * Vout) + (Ca * Tin * Vout)) * EF * ED / (BW * AT * 365);
    
    // Ризик канцерогенних ефектів
    const cancerRisk = LADD * SF;

    // Вивести результат
    document.getElementById('cancer-risk-result').innerHTML = `Оцінка ризику розвитку канцерогенних ефектів: ${cancerRisk.toFixed(5)}`;
}
