const {Builder, By, Key, until, Browser} = require('selenium-webdriver');
const downloadsFolder = require('downloads-folder');
const fs = require('fs');

(async function getPython() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    await driver.get('http://www.python.org');
    const footer = driver.wait(until.elementLocated(By.id('site-map')), 20000);

    const windowsLink = await footer.findElement(By.linkText('Windows'));
    await windowsLink.click()

    const releaseLink = driver.wait(until.elementLocated(By.linkText('Python 3.9.0 - Oct. 5, 2020')), 20000);
    await releaseLink.click()

    const fileLink = driver.wait(until.elementLocated(By.linkText('Windows x86-64 web-based installer')), 20000);
    await fileLink.click()
    
    
    await checkDownloads(driver)
  } finally {
    await driver.quit();
  }
})();

const checkDownloads = async (driver) => {
  await driver.sleep(2500);

  fs.readdir(downloadsFolder(), (err, files) => {
    const timer = setInterval(() => {
      const isDownloading = files.some((file) => (
        file.includes('.crdownload') && file.includes('python-3.9.0')
      ));
      
      if(isDownloading) {
        driver.sleep(2500)
      } else {
        clearInterval(timer);
      } 
    }, 2000)   
  });
}