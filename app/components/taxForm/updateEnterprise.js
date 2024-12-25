const enterprises = {
    1: "ПАТ 'Рівнеазот'",
    2: "Хмельницька атомна електростанція",
    3: "КП Броварської міської ради Київської області «Броваритепловодоенергія»"
  };
  
  function updateEnterprise() {
    const object = parseInt(document.getElementById('object').value, 10);
    const enterpriseField = document.getElementById('enterprise');
    enterpriseField.value = enterprises[object] || '';
  }
  