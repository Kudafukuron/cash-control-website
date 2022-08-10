const defaultTransaction = 'Some Transaction';

let wallet = [], total = 0, inContainer = $('#inCash'), outContainer = $('#outCash'), totalContainer = $('#total'), currAmount = 0, deso = defaultTransaction, ido;

function renderFromStorage() {
  const len = wallet.length;
  for (let i = 0; i < len; i++) {
    currAmount = wallet[i].cash;
    deso = wallet[i].des;
    ido = wallet[i].id;
    updateTransaction(currAmount > 0 ? true : false);
  }
  if (!len) updateTotal();
}

function fg() {
  localStorage.removeItem('wallet');
}

function updateIfNeeded() {
  const ourStorage = localStorage.getItem('wallet');
  if (typeof (ourStorage) == 'string' && ourStorage != '[]') wallet = JSON.parse(ourStorage);
}

function saveWallet() {
  localStorage.setItem('wallet', JSON.stringify(wallet));
}

function getMoneyFromInput() {
  return parseInt($('#amount').val());
}

function updateTotal() {
  $('#total').removeClass();

  if (total > 0) $('#total').addClass('green');
  else if (total < 0) $('#total').addClass('red');
  else $('#total').addClass('gray');

  totalContainer.html(total);
}

function updateTransaction(type) {
  let inputMoney = getMoneyFromInput(), description = $('#description').val();
  let container, ids = new Date().getTime();
  if (!isNaN(inputMoney)) currAmount = inputMoney, deso = description, ido = ids;

  if (deso == '') deso = defaultTransaction;

  if (type) {
    if (!isNaN(inputMoney)) {
      wallet.push({
        cash: currAmount,
        id: ido,
        des: deso
      });
    }
    container = inContainer;
    total += Math.abs(currAmount);
  } else {
    if (!isNaN(inputMoney)) {
      wallet.push({
        cash: -currAmount,
        id: ido,
        des: deso
      });
    }
    container = outContainer;
    total -= Math.abs(currAmount);
  }

  updateTotal();

  let btn = '<button id="' + ido + '">Delete</button>';

  let titleContainer = '<h6>' + currAmount + '</h6>', cashContainer = '<div>' + titleContainer + ' ' + deso + ' ' + btn + '</div>';

  container.append(cashContainer);

  $('#' + ido).on('click', function () {
    let idClicked = $(this).attr('id');
    wallet = wallet.filter(function (element) {
      if (element.id == idClicked) {
        if (element.cash < 0) total += Math.abs(element.cash);
        else total -= Math.abs(element.cash);
        updateTotal();
      }
      return element.id != idClicked;
    });
    $(this).closest('div').remove();
    saveWallet();
  });

  saveWallet();
}

$('#add').on('click', function () {
  updateTransaction(true);
});

$('#take').on('click', function () {
  updateTransaction(false);
});

updateIfNeeded();
renderFromStorage();