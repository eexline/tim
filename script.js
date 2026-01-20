// DOM Elements
const modeButtons = document.querySelectorAll('.mode-btn');
const currencySelect = document.getElementById('currencySelect');
const customCurrencySelect = document.getElementById('customCurrencySelect');
const currencyTrigger = document.getElementById('currencyTrigger');
const currencyDropdown = document.getElementById('currencyDropdown');
const currencyText = document.getElementById('currencyText');
const flag1 = document.getElementById('flag1');
const flag2 = document.getElementById('flag2');
const timeframeSelect = document.getElementById('timeframeSelect');
const customTimeframeSelect = document.getElementById('customTimeframeSelect');
const timeframeTrigger = document.getElementById('timeframeTrigger');
const timeframeDropdown = document.getElementById('timeframeDropdown');
const timeframeText = document.getElementById('timeframeText');
const signalPlaceholder = document.getElementById('signalPlaceholder');
const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const signalInfo = document.getElementById('signalInfo');
const calculatingIndicators = document.getElementById('calculatingIndicators');
const getSignalBtn = document.getElementById('getSignalBtn');
const customLanguageSelect = document.getElementById('customLanguageSelect');
const languageTrigger = document.getElementById('languageTrigger');
const languageModal = document.getElementById('languageModal');
const languageModalClose = document.getElementById('languageModalClose');
const languageModalList = document.getElementById('languageModalList');
const languageFlag = document.getElementById('languageFlag');
const newPhotoBtn = document.getElementById('newPhotoBtn');

// State
let selectedImage = null;
let currentMode = 'otc';
let currentLanguage = 'en'; // 'en' or 'ru'

// Telegram WebApp initialization
function initTelegramWebApp() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        
        // Уведомляем Telegram о готовности приложения
        tg.ready();
        
        // Растягиваем окно на всю доступную высоту
        tg.expand();
        
        // Запрашиваем полноэкранный режим
        tg.requestFullscreen();
        
        // Дополнительные настройки для лучшего отображения
        tg.enableClosingConfirmation();
        
        // Устанавливаем отступ для safe area (iPhone notch/Dynamic Island)
        const header = document.querySelector('.header');
        if (header && tg.safeAreaInsets) {
            const topInset = tg.safeAreaInsets.top || 0;
            if (topInset > 0) {
                header.style.paddingTop = `${topInset}px`;
            }
        }
    }
}

// Инициализируем при загрузке страницы
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTelegramWebApp);
} else {
    // Если страница уже загружена, пробуем сразу
    initTelegramWebApp();
    // Также пробуем через небольшую задержку на случай, если скрипт Telegram еще загружается
    setTimeout(initTelegramWebApp, 100);
}

// Translations
const translations = {
    en: {
        selectLanguage: 'Select Language',
        placeholderText: 'Click to take a photo or select an image',
        getSignal: 'GET SIGNAL',
        analyzing: 'ANALYZING...',
        loadMorePhotos: 'Load more photos',
        calculatingIndicators: 'Calculating indicators',
        analyzingIndicators: 'Analyzing technical indicators...',
        calculating: 'Calculating...',
        ready: 'Ready ✓',
        sign: 'SIGNAL',
        currencyPair: 'Currency Pair',
        timeframe: 'Timeframe',
        accuracy: 'Accuracy',
        direction: 'Direction',
        signalFound: 'Signal found',
        buy: 'BUY',
        sell: 'SELL'
    },
    ru: {
        selectLanguage: 'Выбрать язык',
        placeholderText: 'Нажмите, чтобы сделать фото или выбрать изображение',
        getSignal: 'ПОЛУЧИТЬ СИГНАЛ',
        analyzing: 'АНАЛИЗИРУЮ...',
        loadMorePhotos: 'Загрузить еще фото',
        calculatingIndicators: 'Вычисление индикаторов',
        analyzingIndicators: 'Анализ технических индикаторов...',
        calculating: 'Вычисляется...',
        ready: 'Готово ✓',
        sign: 'СИГНАЛ',
        currencyPair: 'Валютная пара',
        timeframe: 'Таймфрейм',
        accuracy: 'Точность',
        direction: 'Направление',
        signalFound: 'Сигнал найден',
        buy: 'ПОКУПКА',
        sell: 'ПРОДАЖА'
    }
};

// Timeframe options
const timeframeOptions = {
    forex: [
        { value: '1m', label: '1M' },
        { value: '3m', label: '3M' },
        { value: '5m', label: '5M' },
        { value: '15m', label: '15M' },
        { value: '30m', label: '30M' }
    ],
    otc: [
        { value: '5s', label: '5S' },
        { value: '15s', label: '15S' },
        { value: '30s', label: '30S' },
        { value: '1m', label: '1M' },
        { value: '5m', label: '5M' },
        { value: '15m', label: '15M' }
    ]
};

// Mode Selection
modeButtons.forEach(btn => {
    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        modeButtons.forEach(b => {
            b.classList.remove('active');
            b.style.transform = 'scale(1)';
        });
        btn.classList.add('active');
        btn.style.transform = 'scale(1.05)';
        setTimeout(() => {
            btn.style.transform = 'scale(1.02)';
        }, 200);
        currentMode = btn.dataset.mode;
        updateCurrencyOptions();
        updateCustomCurrencyOptions();
        updateTimeframeOptions();
        
        // Force blur immediately
        setTimeout(() => {
            btn.blur();
            if (document.activeElement) {
                document.activeElement.blur();
            }
            // Force remove focus from body
            if (document.body) {
                document.body.focus();
                document.body.blur();
            }
        }, 0);
    };
    
    btn.addEventListener('mousedown', (e) => e.preventDefault());
    btn.addEventListener('touchstart', (e) => e.preventDefault());
    btn.addEventListener('click', handleClick);
    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        handleClick(e);
        btn.blur();
    });
    btn.addEventListener('mouseup', (e) => {
        e.preventDefault();
        btn.blur();
    });
    btn.addEventListener('mouseleave', () => btn.blur());
    btn.addEventListener('touchcancel', () => btn.blur());
});

// Update currency options based on mode
function updateCurrencyOptions() {
    const options = currencySelect.querySelectorAll('option');
    const selectedValue = currencySelect.value;
    
    options.forEach(option => {
        const pair = option.value;
        // For Forex: just the pair name, for OTC: pair name + " OTC"
        if (currentMode === 'otc') {
            option.textContent = `${pair} OTC`;
        } else {
            option.textContent = pair;
        }
    });
    
    currencySelect.value = selectedValue;
}

// Update timeframe options based on mode
function updateTimeframeOptions() {
    const options = timeframeOptions[currentMode];
    const currentValue = timeframeSelect.value;
    
    // Update hidden select
    timeframeSelect.innerHTML = '';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.label;
        timeframeSelect.appendChild(optionElement);
    });
    
    // Try to set previous value if it exists in new options
    let selectedValue = options[0].value;
    if (options.find(opt => opt.value === currentValue)) {
        selectedValue = currentValue;
    }
    timeframeSelect.value = selectedValue;
    
    // Update custom dropdown
    timeframeDropdown.innerHTML = '';
    options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'custom-option';
        optionDiv.dataset.value = option.value;
        optionDiv.innerHTML = `<span class="timeframe-text">${option.label}</span>`;
        
        if (option.value === selectedValue) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            const value = optionDiv.dataset.value;
            
            // Update hidden select
            timeframeSelect.value = value;
            
            // Update trigger display
            timeframeText.textContent = option.label;
            
            // Update selected state
            timeframeDropdown.querySelectorAll('.custom-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            optionDiv.classList.add('selected');
            
            // Close dropdown
            timeframeTrigger.classList.remove('active');
            timeframeDropdown.classList.remove('open');
            
            // Trigger change event
            timeframeSelect.dispatchEvent(new Event('change'));
            
            // Remove focus
            setTimeout(() => {
                removeAllFocus();
            }, 100);
        });
        
        timeframeDropdown.appendChild(optionDiv);
    });
    
    // Update trigger text
    const selectedOption = options.find(opt => opt.value === selectedValue);
    if (selectedOption) {
        timeframeText.textContent = selectedOption.label;
    }
}

// Custom Currency Selector functionality
currencyTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // Close other dropdowns if open
    timeframeTrigger.classList.remove('active');
    timeframeDropdown.classList.remove('open');
    if (languageModal) {
        languageModal.classList.remove('active');
    }
    // Toggle currency dropdown
    currencyTrigger.classList.toggle('active');
    currencyDropdown.classList.toggle('open');
});

// Custom Timeframe Selector functionality
timeframeTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // Close other dropdowns if open
    currencyTrigger.classList.remove('active');
    currencyDropdown.classList.remove('open');
    if (languageModal) {
        languageModal.classList.remove('active');
    }
    // Toggle timeframe dropdown
    timeframeTrigger.classList.toggle('active');
    timeframeDropdown.classList.toggle('open');
});

// Custom Language Selector functionality - Open Modal
languageTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    // Close other dropdowns if open
    currencyTrigger.classList.remove('active');
    currencyDropdown.classList.remove('open');
    timeframeTrigger.classList.remove('active');
    timeframeDropdown.classList.remove('open');
    // Open language modal
    languageModal.classList.add('active');
    updateLanguageModalTitle();
});

// Close modal button
languageModalClose.addEventListener('click', (e) => {
    e.stopPropagation();
    languageModal.classList.remove('active');
    setTimeout(() => {
        removeAllFocus();
    }, 100);
});

// Close modal when clicking outside
languageModal.addEventListener('click', (e) => {
    if (e.target === languageModal) {
        languageModal.classList.remove('active');
        setTimeout(() => {
            removeAllFocus();
        }, 100);
    }
});

// Handle language option selection
languageModalList.querySelectorAll('.language-modal-option').forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = option.dataset.lang;
        const flag = option.dataset.flag;
        
        if (lang && lang !== currentLanguage) {
            // Update language
            currentLanguage = lang;
            
            // Save to localStorage
            localStorage.setItem('language', currentLanguage);
            
            // Update trigger display
            languageFlag.src = `svg/${flag}.svg`;
            
            // Update selected state
            languageModalList.querySelectorAll('.language-modal-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            option.classList.add('selected');
            
            // Close modal
            languageModal.classList.remove('active');
            
            // Update all text
            updateLanguage();
        } else {
            // Just close modal if same language selected
            languageModal.classList.remove('active');
        }
        
        // Remove focus
        setTimeout(() => {
            removeAllFocus();
        }, 100);
    });
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!customCurrencySelect.contains(e.target)) {
        currencyTrigger.classList.remove('active');
        currencyDropdown.classList.remove('open');
    }
    if (!customTimeframeSelect.contains(e.target)) {
        timeframeTrigger.classList.remove('active');
        timeframeDropdown.classList.remove('open');
    }
});

// Handle option selection
currencyDropdown.querySelectorAll('.custom-option').forEach(option => {
    option.addEventListener('click', (e) => {
        e.stopPropagation();
        const value = option.dataset.value;
        const flag1Value = option.dataset.flag1;
        const flag2Value = option.dataset.flag2;
        
        // Update hidden select
        currencySelect.value = value;
        
        // Update trigger display
        if (currentMode === 'otc') {
            currencyText.textContent = `${value} OTC`;
        } else {
            currencyText.textContent = value;
        }
        
        // Update flags
        if (flag1 && flag2 && flag1Value && flag2Value) {
            flag1.src = `svg/${flag1Value}.svg`;
            flag2.src = `svg/${flag2Value}.svg`;
        }
        
        // Update selected state
        currencyDropdown.querySelectorAll('.custom-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        // Close dropdown
        currencyTrigger.classList.remove('active');
        currencyDropdown.classList.remove('open');
        
        // Trigger change event
        currencySelect.dispatchEvent(new Event('change'));
        
        // Remove focus
        setTimeout(() => {
            removeAllFocus();
        }, 100);
    });
});

// Update currency select when mode changes
currencySelect.addEventListener('change', () => {
    updateCurrencyOptions();
    updateCustomCurrencyOptions();
});

timeframeSelect.addEventListener('change', () => {
    // Remove focus styles immediately
    timeframeSelect.style.outline = 'none';
    timeframeSelect.style.borderColor = 'rgba(255, 255, 255, 0.2)';
    timeframeSelect.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    // Blur after selection is made
    setTimeout(() => {
        timeframeSelect.blur();
        removeAllFocus();
    }, 100);
});

// Function to remove focus from all elements
function removeAllFocus() {
    if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
    }
    if (document.body) {
        document.body.focus();
        document.body.blur();
    }
}

// Remove focus when clicking/touching anywhere on the page
document.addEventListener('touchstart', (e) => {
    // Don't blur if clicking on a select that's opening
    if (e.target === currencySelect || e.target === timeframeSelect) {
        return;
    }
    // Remove focus from other elements when touching something new
    if (document.activeElement && 
        document.activeElement !== e.target && 
        document.activeElement !== currencySelect && 
        document.activeElement !== timeframeSelect) {
        document.activeElement.blur();
    }
}, true);

document.addEventListener('touchend', (e) => {
    // If not clicking on an interactive element, remove all focus
    const interactiveElements = [
        currencySelect, 
        timeframeSelect, 
        getSignalBtn, 
        newPhotoBtn, 
        customLanguageSelect,
        signalPlaceholder,
        ...modeButtons
    ];
    
    if (!interactiveElements.includes(e.target) && 
        !interactiveElements.some(el => el.contains(e.target))) {
        setTimeout(() => {
            removeAllFocus();
        }, 100);
    }
}, true);

// Also handle mouse clicks for desktop
document.addEventListener('mousedown', (e) => {
    if (e.target === currencySelect || e.target === timeframeSelect) {
        return;
    }
    // Remove focus styles from selects
    if (document.activeElement === currencySelect || document.activeElement === timeframeSelect) {
        const activeSelect = document.activeElement;
        activeSelect.style.outline = 'none';
        activeSelect.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        activeSelect.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.2)';
    }
    if (document.activeElement && 
        document.activeElement !== e.target && 
        document.activeElement !== currencySelect && 
        document.activeElement !== timeframeSelect) {
        document.activeElement.blur();
    }
}, true);

// Image Upload/Capture
const handlePlaceholderClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    imageInput.click();
    setTimeout(() => {
        signalPlaceholder.blur();
        if (document.activeElement) {
            document.activeElement.blur();
        }
        if (document.body) {
            document.body.focus();
            document.body.blur();
        }
    }, 0);
};

signalPlaceholder.addEventListener('mousedown', (e) => e.preventDefault());
signalPlaceholder.addEventListener('touchstart', (e) => e.preventDefault());
signalPlaceholder.addEventListener('click', handlePlaceholderClick);
signalPlaceholder.addEventListener('touchend', (e) => {
    e.preventDefault();
    handlePlaceholderClick(e);
    signalPlaceholder.blur();
});
signalPlaceholder.addEventListener('mouseup', (e) => {
    e.preventDefault();
    signalPlaceholder.blur();
});
signalPlaceholder.addEventListener('mouseleave', () => signalPlaceholder.blur());
signalPlaceholder.addEventListener('touchcancel', () => signalPlaceholder.blur());

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            selectedImage = event.target.result;
            previewImage.src = selectedImage;
            
            // Smooth fade out placeholder
            signalPlaceholder.style.opacity = '0';
            signalPlaceholder.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                signalPlaceholder.style.display = 'none';
                previewImage.style.display = 'block';
                previewImage.style.opacity = '0';
                signalInfo.style.display = 'none';
                
                // Smooth fade in image
                setTimeout(() => {
                    previewImage.style.transition = 'opacity 0.5s ease';
                    previewImage.style.opacity = '1';
                }, 50);
            }, 300);
            
            getSignalBtn.disabled = false;
            getSignalBtn.style.opacity = '1';
            getSignalBtn.style.cursor = 'pointer';
            getSignalBtn.style.transform = 'scale(1)';
        };
        reader.readAsDataURL(file);
    }
});

// Get Signal Button
const handleGetSignalClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImage) {
        // Smooth animation when no photo
        getSignalBtn.style.transition = 'all 0.3s ease';
        getSignalBtn.style.transform = 'scale(0.95)';
        getSignalBtn.style.opacity = '0.7';
        
        setTimeout(() => {
            getSignalBtn.style.transform = 'scale(1)';
            getSignalBtn.style.opacity = '1';
        }, 150);
        
        setTimeout(() => {
            getSignalBtn.style.transition = '';
            getSignalBtn.blur();
            if (document.activeElement) {
                document.activeElement.blur();
            }
            if (document.body) {
                document.body.focus();
                document.body.blur();
            }
        }, 300);
        return;
    }

    // Hide preview image with animation
    previewImage.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    previewImage.style.opacity = '0';
    previewImage.style.transform = 'scale(0.95)';
    
    // Disable button during analysis
    getSignalBtn.disabled = true;
    getSignalBtn.classList.add('loading');
    getSignalBtn.textContent = translations[currentLanguage].analyzing;
    getSignalBtn.style.background = 'linear-gradient(135deg, #ffa500 0%, #ffa500 100%)';
    
    // Hide signal placeholder and signal info if visible
    signalPlaceholder.style.display = 'none';
    signalInfo.style.display = 'none';
    
    // Show calculating indicators immediately
    setTimeout(() => {
        previewImage.style.display = 'none';
        calculatingIndicators.style.display = 'flex';
        calculatingIndicators.style.opacity = '0';
        setTimeout(() => {
            calculatingIndicators.style.transition = 'opacity 0.5s ease';
            calculatingIndicators.style.opacity = '1';
        }, 50);
        
        // Animate indicators calculation
        animateIndicatorsCalculation();
    }, 300);
    
    // After indicators calculation, show signal
    setTimeout(() => {
        calculatingIndicators.style.opacity = '0';
        setTimeout(() => {
            calculatingIndicators.style.display = 'none';
            analyzeSignal();
            
            // Hide GET SIGNAL button and show NEW PHOTO button
            getSignalBtn.classList.remove('loading');
            getSignalBtn.style.display = 'none';
            newPhotoBtn.style.display = 'flex';
            newPhotoBtn.style.opacity = '0';
            newPhotoBtn.disabled = false;
            newPhotoBtn.classList.remove('loading');
            setTimeout(() => {
                newPhotoBtn.style.transition = 'opacity 0.5s ease';
                newPhotoBtn.style.opacity = '1';
            }, 100);
            setTimeout(() => {
                getSignalBtn.blur();
                if (document.activeElement) {
                    document.activeElement.blur();
                }
                if (document.body) {
                    document.body.focus();
                    document.body.blur();
                }
            }, 0);
        }, 500);
    }, 2800); // 300ms (hide image) + 2500ms (indicators calculation)
};

getSignalBtn.addEventListener('mousedown', (e) => e.preventDefault());
getSignalBtn.addEventListener('touchstart', (e) => e.preventDefault());
getSignalBtn.addEventListener('click', handleGetSignalClick);
getSignalBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleGetSignalClick(e);
    getSignalBtn.blur();
});
getSignalBtn.addEventListener('mouseup', (e) => {
    e.preventDefault();
    getSignalBtn.blur();
});
getSignalBtn.addEventListener('mouseleave', () => getSignalBtn.blur());
getSignalBtn.addEventListener('touchcancel', () => getSignalBtn.blur());

getSignalBtn.addEventListener('mouseleave', () => {
    getSignalBtn.blur();
});

// Animate indicators calculation
function animateIndicatorsCalculation() {
    const indicators = calculatingIndicators.querySelectorAll('.indicator-item');
    const delay = 400; // Delay between each indicator
    
    // Reset all indicators to calculating state first
    indicators.forEach((indicator) => {
        const status = indicator.querySelector('.indicator-status');
        status.classList.remove('completed');
        status.classList.add('calculating');
        status.textContent = translations[currentLanguage].calculating;
    });
    
    // Then animate them to completed state
    indicators.forEach((indicator, index) => {
        setTimeout(() => {
            const status = indicator.querySelector('.indicator-status');
            status.classList.remove('calculating');
            status.classList.add('completed');
            status.textContent = translations[currentLanguage].ready;
        }, delay * (index + 1));
    });
}

// Fake Signal Analysis
function analyzeSignal() {
    // Generate fake prediction
    const directions = ['BUY', 'SELL'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    const isUp = randomDirection === 'BUY';
    const accuracy = Math.floor(Math.random() * 30) + 65; // 65-95%
    
    // Get selected currency pair info
    const selectedOption = currencySelect.options[currencySelect.selectedIndex];
    const pairValue = selectedOption.value;
    const flag1Value = selectedOption.dataset.flag1;
    const flag2Value = selectedOption.dataset.flag2;
    
    // Update currency pair flags
    const signalCurrencyFlags = document.getElementById('signalCurrencyFlags');
    if (signalCurrencyFlags && flag1Value && flag2Value) {
        signalCurrencyFlags.innerHTML = `
            <img src="svg/${flag1Value}.svg" alt="${flag1Value.toUpperCase()}" class="flag-icon">
            <img src="svg/${flag2Value}.svg" alt="${flag2Value.toUpperCase()}" class="flag-icon">
        `;
    }
    
    // Update currency pair text
    const pairText = currentMode === 'otc' ? `${pairValue} OTC` : pairValue;
    document.getElementById('detailPair').textContent = pairText;
    
    // Update timeframe
    document.getElementById('detailTimeframe').textContent = timeframeSelect.value;
    
    // Animate accuracy counter
    const accuracyElement = document.getElementById('detailAccuracy');
    let currentAccuracy = 0;
    const accuracyInterval = setInterval(() => {
        currentAccuracy += 2;
        if (currentAccuracy >= accuracy) {
            currentAccuracy = accuracy;
            clearInterval(accuracyInterval);
        }
        accuracyElement.textContent = currentAccuracy + '%';
    }, 30);
    
    // Update direction
    const directionElement = document.getElementById('detailDirection');
    const directionIcon = document.getElementById('directionIcon');
    const t = translations[currentLanguage];
    directionElement.textContent = isUp ? t.buy : t.sell;
    directionElement.className = 'direction-text ' + (isUp ? 'up' : 'down');
    // Store direction type for language updates
    directionElement.dataset.direction = isUp ? 'buy' : 'sell';
    
    // Update direction icon
    if (directionIcon) {
        directionIcon.className = 'direction-icon ' + (isUp ? 'up' : 'down');
        if (isUp) {
            directionIcon.innerHTML = `
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L12 12L17 17M7 11L12 6L17 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        } else {
            directionIcon.innerHTML = `
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 13L12 18L17 13M7 6L12 11L17 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
    }
    
    // Show signal info with animation
    signalInfo.style.display = 'block';
    signalInfo.style.opacity = '0';
    signalInfo.style.transform = 'translateY(20px) scale(0.95)';
    
    setTimeout(() => {
        signalInfo.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        signalInfo.style.opacity = '1';
        signalInfo.style.transform = 'translateY(0) scale(1)';
    }, 50);
    
    // Animate progress bar
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    progressFill.style.width = '0%';
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 2;
        if (progress > 100) {
            progress = 100;
            clearInterval(progressInterval);
        }
        progressFill.style.width = progress + '%';
        progressPercent.textContent = progress + '%';
    }, 20);
}

// Update all text content based on current language
function updateLanguage() {
    const t = translations[currentLanguage];
    
    // Language selector - update trigger display
    if (languageFlag) {
        languageFlag.src = currentLanguage === 'en' ? 'svg/gb.svg' : 'svg/ru.svg';
    }
    
    // Placeholder text
    const placeholderText = document.querySelector('.placeholder-text');
    if (placeholderText) {
        placeholderText.textContent = t.placeholderText;
    }
    
    // Get Signal button
    if (getSignalBtn && !getSignalBtn.classList.contains('loading')) {
        getSignalBtn.textContent = t.getSignal;
    }
    
    // New Photo button
    const newPhotoBtnSvg = newPhotoBtn.querySelector('svg');
    if (newPhotoBtnSvg) {
        // Find and update text node after SVG
        let textNode = newPhotoBtnSvg.nextSibling;
        // Remove all text nodes after SVG
        while (textNode && textNode.nodeType === 3) {
            const toRemove = textNode;
            textNode = textNode.nextSibling;
            toRemove.remove();
        }
        // Add new text node
        const newTextNode = document.createTextNode(' ' + t.loadMorePhotos);
        newPhotoBtn.insertBefore(newTextNode, newPhotoBtnSvg.nextSibling);
    }
    
    // Calculating indicators
    const calculatingTitle = document.querySelector('.calculating-title');
    if (calculatingTitle) {
        calculatingTitle.textContent = t.calculatingIndicators;
    }
    
    const calculatingText = document.querySelector('.calculating-text');
    if (calculatingText) {
        calculatingText.textContent = t.analyzingIndicators;
    }
    
    // Signal info labels - update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (t[key]) {
            element.textContent = t[key];
        }
    });
    
    // Update direction text if signal was already generated
    const directionElement = document.getElementById('detailDirection');
    if (directionElement && directionElement.dataset.direction) {
        const directionType = directionElement.dataset.direction;
        directionElement.textContent = directionType === 'buy' ? t.buy : t.sell;
    }
    
    // Update modal title if modal is open
    updateLanguageModalTitle();
}

// Custom Language Selector functionality (already defined above)

// Load language from localStorage on page load
function initLanguage() {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ru')) {
        currentLanguage = savedLanguage;
    } else {
        currentLanguage = 'en'; // Default to English
    }
    
    // Update language selector display
    if (languageFlag) {
        languageFlag.src = currentLanguage === 'en' ? 'svg/gb.svg' : 'svg/ru.svg';
        
        // Update selected state in modal
        if (languageModalList) {
            languageModalList.querySelectorAll('.language-modal-option').forEach(opt => {
                opt.classList.remove('selected');
                if (opt.dataset.lang === currentLanguage) {
                    opt.classList.add('selected');
                }
            });
        }
    }
    
    // Update all text content after language is loaded
    updateLanguage();
}

// Update language modal title
function updateLanguageModalTitle() {
    const title = document.querySelector('.language-modal-title');
    if (title) {
        title.textContent = currentLanguage === 'en' ? 'Select the language' : 'Выберите язык';
    }
}

// Close language dropdown when clicking outside
document.addEventListener('click', (e) => {
});

// New Photo Button
const handleNewPhotoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Remove loading state immediately
    newPhotoBtn.classList.remove('loading');
    newPhotoBtn.disabled = false;
    resetToPhotoUpload();
    setTimeout(() => {
        newPhotoBtn.blur();
        if (document.activeElement) {
            document.activeElement.blur();
        }
        if (document.body) {
            document.body.focus();
            document.body.blur();
        }
    }, 0);
};

newPhotoBtn.addEventListener('mousedown', (e) => e.preventDefault());
newPhotoBtn.addEventListener('touchstart', (e) => e.preventDefault());
newPhotoBtn.addEventListener('click', handleNewPhotoClick);
newPhotoBtn.addEventListener('touchend', (e) => {
    e.preventDefault();
    handleNewPhotoClick(e);
    newPhotoBtn.blur();
});
newPhotoBtn.addEventListener('mouseup', (e) => {
    e.preventDefault();
    newPhotoBtn.blur();
});
newPhotoBtn.addEventListener('mouseleave', () => newPhotoBtn.blur());
newPhotoBtn.addEventListener('touchcancel', () => newPhotoBtn.blur());

// Reset to photo upload state
function resetToPhotoUpload() {
    selectedImage = null;
    previewImage.src = '';
    previewImage.style.display = 'none';
    signalInfo.style.display = 'none';
    calculatingIndicators.style.display = 'none';
    calculatingIndicators.style.opacity = '0';
    signalPlaceholder.style.display = 'flex';
    signalPlaceholder.style.opacity = '1';
    signalPlaceholder.style.transform = 'scale(1)';
    imageInput.value = '';
    
    // Reset indicators status
    const indicators = calculatingIndicators.querySelectorAll('.indicator-status');
    indicators.forEach(status => {
        status.classList.remove('completed');
        status.classList.add('calculating');
        status.textContent = 'Вычисляется...';
    });
    
    // Hide new photo button and show GET SIGNAL button
    newPhotoBtn.style.opacity = '0';
    newPhotoBtn.classList.remove('loading');
    setTimeout(() => {
        newPhotoBtn.style.display = 'none';
        getSignalBtn.style.display = 'block';
        getSignalBtn.disabled = true;
        getSignalBtn.style.opacity = '0.5';
        getSignalBtn.style.cursor = 'not-allowed';
        getSignalBtn.textContent = translations[currentLanguage].getSignal;
        getSignalBtn.style.background = 'linear-gradient(135deg, #ffa500 0%, #ffd700 100%)';
        getSignalBtn.classList.remove('loading');
    }, 300);
}

// Initialize language on page load
initLanguage();

// Initialize
getSignalBtn.disabled = true;
getSignalBtn.style.opacity = '0.5';
getSignalBtn.style.cursor = 'not-allowed';

// Initialize timeframes and currency select
updateTimeframeOptions();
updateCurrencyOptions();

// Set initial selected option in custom dropdown
const initialOption = currencyDropdown.querySelector('.custom-option[data-value="EURUSD"]');
if (initialOption) {
    initialOption.classList.add('selected');
}

// Update all custom options when mode changes
function updateCustomCurrencyOptions() {
    const customOptions = currencyDropdown.querySelectorAll('.custom-option');
    const selectedValue = currencySelect.value;
    
    customOptions.forEach(option => {
        const optionValue = option.dataset.value;
        const optionText = option.querySelector('.currency-text');
        
        if (currentMode === 'otc') {
            optionText.textContent = `${optionValue} OTC`;
        } else {
            optionText.textContent = optionValue;
        }
        
        // Update selected state
        if (optionValue === selectedValue) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    });
    
    // Update trigger text
    if (currentMode === 'otc') {
        currencyText.textContent = `${selectedValue} OTC`;
    } else {
        currencyText.textContent = selectedValue;
    }
}

