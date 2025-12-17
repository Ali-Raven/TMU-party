const list = document.getElementById('list');
const countSpan = document.getElementById('count');
const totalSpan = document.getElementById('total');
const search = document.getElementById('search');
const download = document.getElementById("download-csv");
// search.setAttribute("class" , "search-container")

const guests = [
    'زهرا دهاقین',
    'مریم عاملی',
    'فاطمه ناظری',
    'سجاد بیناباجی',
    'سیروان میرزابیگی',
    'عقیل رضایی',
    'محدثه گلرخی',
    'فرزانه ساعی راد',
    'سارا مقیمی',
    'فائزه سادات شبیری',
    'فاطمه خادمی',
    'فاطمه الهامی',
    'فرشته عیدی',
    'محدثه حسینی سوق',
    'مارال اله وردی',
    'مبینا نوری',
    'زهرا کرمی',
    'الهه احمدی',
    'ریحانه صادقی',
    'محمدرضا حسینی',
    'زهرا رحمتی',
    'ریحانه مسلمی',
    'حدیث علی گو',
    'مریم خراسانی',
    'کیانا شیخی',
    'نادر‌مهنانی',
    'زهرا حمیدی',
    'ساجده داعی',
    'سمیرا علی پور',
    'ثمین داودی',
    'زینب کریم نژاد',
    'نگین حسینائی',
    'زهرا کیخا',
    'جابر کوچکی',
    'ابوالفضل مهرعلیان',
    'پگاه حضرتی'
]

totalSpan.textContent = guests.length;

function save() {
    localStorage.setItem('checkedGuests', JSON.stringify(
        guests.map((g, i) => document.getElementById('c' + i).checked)
    ));
}

function load() {
    const saved = localStorage.getItem('checkedGuests');
    return saved ? JSON.parse(saved) : [];
}

function updateCount() {
    const checked = guests.filter((_, i) => document.getElementById('c' + i).checked).length;
    countSpan.textContent = checked;
}

// Build the list
guests.forEach((guest, i) => {
    const li = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.setAttribute("class", "checkbox")
    checkbox.type = 'checkbox';
    checkbox.id = 'c' + i;

    const label = document.createElement('label');
    label.setAttribute("class", "input_label")
    label.htmlFor = 'c' + i;
    label.textContent = guest;

    checkbox.addEventListener('change', () => {
        li.classList.toggle('checked', checkbox.checked);
        updateCount();
        save();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    list.appendChild(li);
});

// Load previous checks
const saved = load();
saved.forEach((checked, i) => {
    if (checked && document.getElementById('c' + i)) {
        const cb = document.getElementById('c' + i);
        cb.checked = true;
        cb.dispatchEvent(new Event('change'));
    }
});
updateCount();

// Live search
search.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('li').forEach(li => {
        const name = li.querySelector('label').textContent.toLowerCase();
        li.style.display = name.includes(term) ? 'flex' : 'none';
    });
});


// download file csv or exel 
document.getElementById('download-csv').addEventListener('click', () => {
    const checkedGuests = guests.filter((_, i) =>
        document.getElementById('c' + i).checked
    );

    if (checkedGuests.length === 0) {
        alert('No guests have arrived yet!');
        return;
    }

    // Create CSV content (with BOM for better Excel support)
    let csv = '\uFEFFName,Status\r\n';
    checkedGuests.forEach(name => {
        csv += `"${name}","Arrived"\r\n`;
    });

    // Create blob and URL
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Detect if mobile (especially iOS)
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isMobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isIOS || isMobile) {
        // On mobile/iOS: Open in new tab for easy sharing/saving
        const newTab = window.open(url, '_blank');
        if (newTab) {
            newTab.focus();
        } else {
            alert('Please allow pop-ups to view and save the file.');
        }
        // Clean up URL after a delay
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    } else {
        // On desktop: Automatic download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'arrived-guests.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
});




