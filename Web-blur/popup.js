document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleBlur");
  const blurSlider = document.getElementById("blurAmount");
  const blurValue = document.getElementById("blurValue");
  const currentShortcut = document.getElementById("currentShortcut");
  const changeShortcutLink = document.getElementById("changeShortcut");
  let isBlurred = false;

  // 从存储中加载模糊值
  chrome.storage.sync.get(["blurAmount"], function (result) {
    const savedBlurAmount = result.blurAmount || 5; // 默认值为5
    blurSlider.value = savedBlurAmount;
    blurValue.textContent = savedBlurAmount + "px";
  });

  // 更新滑块值显示
  blurSlider.addEventListener("input", function () {
    const value = this.value;
    blurValue.textContent = value + "px";
  });

  // 保存模糊值到存储
  blurSlider.addEventListener("change", function () {
    const value = this.value;
    // 保存到Chrome存储
    chrome.storage.sync.set({ blurAmount: value });

    if (isBlurred) {
      sendMessageToContentScript({
        action: "updateBlur",
        blurAmount: value,
      });
    }
  });

  // 发送消息到content script
  function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
          if (chrome.runtime.lastError) {
            console.error("Error:", chrome.runtime.lastError);
          } else {
            console.log("Response:", response);
          }
        });
      }
    });
  }

  // 切换模糊效果
  function toggleBlur() {
    isBlurred = !isBlurred;
    const blurAmount = isBlurred ? blurSlider.value : 0;

    sendMessageToContentScript({
      action: "toggleBlur",
      blurAmount: blurAmount,
    });

    toggleButton.textContent = isBlurred ? "Remove Blur" : "Apply Blur";
  }

  // 按钮点击事件
  toggleButton.addEventListener("click", toggleBlur);

  // 获取当前快捷键
  function updateShortcutDisplay() {
    chrome.commands.getAll(function (commands) {
      const toggleCommand = commands.find((cmd) => cmd.name === "toggle-blur");
      if (toggleCommand && toggleCommand.shortcut) {
        currentShortcut.textContent = `Current: ${toggleCommand.shortcut}`;
      }
    });
  }

  // 更新快捷键显示
  updateShortcutDisplay();

  // 点击更改快捷键链接
  changeShortcutLink.addEventListener("click", function (e) {
    e.preventDefault();
    chrome.tabs.create({
      url: "chrome://extensions/shortcuts",
    });
  });

  // 获取当前标签页的模糊状态
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs[0]) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        {
          action: "getBlurState",
        },
        function (response) {
          if (response && response.isBlurred !== undefined) {
            isBlurred = response.isBlurred;
            toggleButton.textContent = isBlurred ? "Remove Blur" : "Apply Blur";
          }
        }
      );
    }
  });
});
