"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  UiElement: () => UiElement,
  closeplaywrightWrapper: () => closeplaywrightWrapper,
  getApiResponse: () => getApiResponse,
  getUrl: () => getUrl,
  gotoUrl: () => gotoUrl,
  invokeBrowser: () => invokeBrowser,
  keyboard: () => keyboard,
  loopThroughElementsAndClick: () => loopThroughElementsAndClick,
  pause: () => pause,
  playwrightWrapper: () => playwrightWrapper,
  refreshPage: () => refreshPage,
  staticWait: () => staticWait,
  waitForPageLoad: () => waitForPageLoad,
  waitForSpinnerHidden: () => waitForSpinnerHidden,
  waitForUrl: () => waitForUrl
});
module.exports = __toCommonJS(index_exports);

// src/lib/playwrightWrapper.ts
var import_test = require("@playwright/test");
var import_test_automation_library = require("@qe-solutions/test-automation-library");
var import_playwright_dompath = require("playwright-dompath");
var UiElement = class _UiElement {
  //description: string = "Object - ", isPopup: boolean = false, pageIndex: number = 0
  constructor(locator, options) {
    this.fullXpath = "";
    this.tempLocators = [];
    this.locator = locator;
    this.fullCss = this.locator;
    this.isPopupExist = options?.isPopup?.valueOf() !== void 0 ? options?.isPopup?.valueOf() : false;
    this.pageIndex = options?.pageIndex?.valueOf() !== void 0 ? options?.pageIndex?.valueOf() : 0;
    this.objectDescriptor = options?.description?.valueOf() !== void 0 ? options?.description?.valueOf() : "Object - ";
    this.hasFrame = options?.frameLocator?.valueOf() === void 0 ? false : true;
    this.stringFramelocator = options?.frameLocator === void 0 ? "" : options?.frameLocator;
  }
  async getPage() {
    if (this.isPopupExist === true) {
      if (playwrightWrapper.popup === void 0) {
        this.page = playwrightWrapper.popup;
        const [newPopup] = await Promise.all([
          playwrightWrapper.page.waitForEvent("popup")
        ]);
        playwrightWrapper.popup = newPopup;
      }
      this.page = playwrightWrapper.popup;
    } else {
      const pages = playwrightWrapper.context.pages();
      this.page = pages[this.pageIndex];
    }
    if (playwrightWrapper.commonFrameLocator) {
      this.stringFramelocator = playwrightWrapper.commonFrameLocator;
    }
    if (this.stringFramelocator !== "") {
      await this.setHasFrame(true);
    } else {
      await this.setHasFrame(false);
    }
    this.frameLocator = await this.getHasFrame() ? this.page.frameLocator(this.stringFramelocator) : this.frameLocator;
  }
  async switchPage(pageIndex) {
    this.pageIndex = pageIndex;
    return this;
  }
  async setFrameLocator(loc) {
    this.stringFramelocator = loc;
  }
  async setHasFrame(flag) {
    this.hasFrame = flag;
  }
  async getHasFrame() {
    return this.hasFrame;
  }
  async setLocator(locator, options) {
    await this.clearFullCssAndXPath();
    this.locator = locator;
    this.fullCss = this.locator;
    if (options?.description?.valueOf() !== void 0) this.objectDescriptor = options?.description;
    return this;
  }
  async clickToOpenPopup(options) {
    let _force = options?.force?.valueOf() !== void 0 ? options?.force : false;
    const [newPopup] = await Promise.all([
      playwrightWrapper.page.waitForEvent("popup"),
      playwrightWrapper.page.locator(await this.getLocator()).click({ force: _force })
    ]);
    playwrightWrapper.popup = newPopup;
  }
  async getElements() {
    return await this.waitTillElementToBeReady().then(async () => {
      let elements = await this.getHasFrame() ? this.page.frameLocator(this.stringFramelocator).locator(await this.getLocator()).all() : this.page.locator(await this.getLocator()).all();
      return elements;
    });
  }
  async getElement() {
    return await this.waitTillElementToBeReady().then(async () => {
      let ele = await this.getHasFrame() ? this.page.frameLocator(this.stringFramelocator).locator(await this.getLocator()) : this.page.locator(await this.getLocator());
      return ele;
    });
  }
  async setCssAndXPath(element) {
    this.fullCss = (await (0, import_playwright_dompath.cssPath)(element)).toString();
    this.fullXpath = (await (0, import_playwright_dompath.xPath)(element)).toString();
  }
  async clickLink(linkName, options) {
    let _linkNameExactMatch = options?.linkNameExactMatch?.valueOf() !== void 0 ? options?.linkNameExactMatch : true;
    let _force = options?.force?.valueOf() !== void 0 ? options?.force : false;
    await this.waitTillElementToBeReady().then(async () => {
      if (linkName) {
        if (!await this.getHasFrame()) {
          await this.page.getByRole("link", {
            name: `${linkName} `,
            exact: _linkNameExactMatch
          }).waitFor();
          await this.page.getByRole("link", {
            name: `${linkName} `,
            exact: _linkNameExactMatch
          }).click({ force: _force });
        } else {
          await this.page.frameLocator(this.stringFramelocator).getByRole("link", {
            name: `${linkName} `,
            exact: _linkNameExactMatch
          }).waitFor();
          await this.page.frameLocator(this.stringFramelocator).getByRole("link", {
            name: `${linkName} `,
            exact: _linkNameExactMatch
          }).click({ force: _force });
        }
        await this.clearFullCssAndXPath();
        playwrightWrapper.logger.info(`clicked on the Link with name - ${linkName} with exact match - ${_linkNameExactMatch} on ${this.objectDescriptor} `);
      }
    });
  }
  async clickLastLink(options) {
    let _force = options?.force?.valueOf() !== void 0 ? options?.force : false;
    playwrightWrapper.logger.info(`clicked on the last link  - ${this.objectDescriptor}`);
    await (await this.getElement()).last().click({ force: _force });
    await this.clearFullCssAndXPath();
  }
  async clickFirstLink(options) {
    let _force = options?.force?.valueOf() !== void 0 ? options?.force : false;
    playwrightWrapper.logger.info(`clicked on the first link  - ${this.objectDescriptor}`);
    await (await this.getElement()).first().click({ force: _force });
    await this.clearFullCssAndXPath();
  }
  async getSibling(locator, nthElement = 0) {
    let ele = (await this.getElement()).locator("xpath=..").locator(locator).nth(nthElement);
    await this.setCssAndXPath(ele);
    return this;
  }
  async getNextSibling(tagName) {
    let ele = await this.getElement();
    await this.setCssAndXPath(ele);
    let loct = this.fullCss + "+" + tagName;
    ele = await this.getHasFrame() ? this.page.frameLocator(this.stringFramelocator).locator(loct) : this.page.locator(loct);
    await this.setCssAndXPath(ele);
    return this;
  }
  async getNextNthSibling(tagName, next = 0) {
    let ele = await this.getElement();
    await this.setCssAndXPath(ele);
    for (let index = 0; index <= next; index++) {
      let loct = this.fullCss + "+" + tagName;
      ele = await this.getHasFrame() ? this.page.frameLocator(this.stringFramelocator).locator(loct) : this.page.locator(loct);
      await this.setCssAndXPath(ele);
    }
    return this;
  }
  async getParent() {
    let ele = (await this.getElement()).locator("..");
    await this.setCssAndXPath(ele);
    return this;
  }
  async getNth(index) {
    let ele = await this.getElement();
    ele = ele.nth(index);
    await this.setCssAndXPath(ele);
    return this;
  }
  async getCount() {
    let length = Number(await (await this.getElement()).count());
    await this.clearFullCssAndXPath();
    return length;
  }
  async getPageObject(index) {
    await (await this.getElement()).nth(index).focus();
    return (await this.getElement()).nth(index);
  }
  async mouseHover() {
    await (await this.getElement()).hover();
  }
  async getObject(index) {
    await (await this.getElement()).nth(index).focus();
    let ele = (await this.getElement()).nth(index);
    await this.setCssAndXPath(ele);
    return this;
  }
  //Value of Input  / TextArea fields
  async getValue(options) {
    let _index = options?.index?.valueOf() !== void 0 ? options?.index : 0;
    await (await this.getElement()).focus();
    let prpVal = await (await this.getElement()).nth(_index).inputValue();
    await this.clearFullCssAndXPath();
    return prpVal ?? "";
  }
  async getPropertyValue(property, options) {
    let _index = options?.index?.valueOf() !== void 0 ? options?.index : 0;
    await (await this.getElement()).focus();
    let prpVal = property.trim().toLowerCase() === "value" ? await (await this.getElement()).nth(_index).inputValue() : await (await this.getElement()).nth(_index).getAttribute(property);
    await this.clearFullCssAndXPath();
    return prpVal ?? "";
  }
  async contains(containsText, options) {
    let _index = options?.index?.valueOf() !== void 0 ? options?.index : 0;
    if (options?.locator?.valueOf() !== void 0) {
      let ele = await (await this.getElement()).locator(options.locator).filter({ hasText: `${containsText}` }).nth(_index);
      await this.setCssAndXPath(ele);
    } else {
      let ele = (await this.getElement()).filter({ hasText: `${containsText}` }).nth(_index);
      await this.setCssAndXPath(ele);
    }
    return this;
  }
  async hasText(containsText, exactMatch = false, options) {
    let _index = options?.index?.valueOf() !== void 0 ? options?.index : 0;
    let ele = (await this.getElement()).getByText(`${containsText}`, { exact: exactMatch }).nth(_index);
    await this.setCssAndXPath(ele);
    return this;
  }
  async clearFullCssAndXPath() {
    this.fullCss = this.locator.toString();
    this.fullXpath = "".toString();
    return this;
  }
  async containsClick(containsText, options) {
    let _force = options?.force?.valueOf() !== void 0 ? options?.force : false;
    let _index = options?.index?.valueOf() !== void 0 ? options?.index : 0;
    await (await this.getElement()).filter({ hasText: `${containsText}` }).nth(_index).click({ force: _force });
    await staticWait(100);
    playwrightWrapper.logger.info(`  clicked on the ${this.objectDescriptor} contains the text : [${containsText}]`);
    await this.clearFullCssAndXPath();
  }
  async waitTillElementToBeReady() {
    await this.getPage();
    await this.page.waitForTimeout(100);
    await this.page.waitForLoadState();
    await this.page.waitForLoadState("domcontentloaded");
  }
  async getText(index = -1) {
    let _index = index === -1 ? 0 : index;
    let text = await (await this.getElement()).nth(_index).innerText();
    await this.clearFullCssAndXPath();
    playwrightWrapper.logger.info(`getting text from the locator : "${this.objectDescriptor}"`);
    return text;
  }
  async getCurrentObject() {
    return this;
  }
  async getPageTitle() {
    await this.getPage();
    let title = (await this.page.title()).toString();
    await this.clearFullCssAndXPath();
    return title;
  }
  async isExist() {
    await this.getPage();
    await this.page.waitForTimeout(10);
    await this.page.waitForLoadState();
    await this.page.waitForLoadState("domcontentloaded");
    let loc = await this.getLocator();
    let length = !await this.getHasFrame() ? await this.page.locator(loc).all() : await this.page.frameLocator(this.stringFramelocator).locator(await this.getLocator()).all();
    let flag = (await length).length > 0;
    await this.clearFullCssAndXPath();
    return flag;
  }
  async isEnabled() {
    let enabled = (await this.getElement()).isEnabled();
    await this.clearFullCssAndXPath();
    return enabled;
  }
  async isDisabled() {
    let disabled = (await this.getElement()).isDisabled();
    await this.clearFullCssAndXPath();
    return disabled;
  }
  async isChecked() {
    let checked = (await this.getElement()).isChecked();
    await this.clearFullCssAndXPath();
    return checked;
  }
  async isVisible() {
    let visible = (await this.getElement()).isVisible();
    await this.clearFullCssAndXPath();
    return visible;
  }
  async scrollIntoView(options = "End") {
    await this.waitTillElementToBeReady();
    if (options.trim().toLowerCase() === "end") {
      await this.page.keyboard.down(options);
    } else if (options.trim().toLowerCase() === "start") {
      await this.page.keyboard.up(options);
    }
  }
  async scrollToBottomOfPage(count = 4) {
    await this.getPage();
    const screenHeight = await this.page.evaluate(() => document.body.scrollHeight);
    for (let index = 0; index < count; index++) {
      await this.page.mouse.wheel(0, screenHeight);
      await staticWait(1e3);
    }
  }
  async scrollToStartOfPage(count = 4) {
    await this.getPage();
    for (let index = 0; index < count; index++) {
      await this.page.mouse.wheel(0, 0);
      await staticWait(1e3);
    }
  }
  async childHasText(text, options) {
    await this.waitTillElementToBeReady();
    let _exactMatch = options?.exactMatch?.valueOf() !== void 0 ? options?.exactMatch : false;
    if (_exactMatch) {
      let ele = await this.getHasFrame() ? this.page.frameLocator(this.stringFramelocator).locator(await this.getLocator(), { has: this.page.frameLocator(this.stringFramelocator).locator(`text="${text}"`).nth(0) }).nth(0) : this.page.locator(await this.getLocator(), { has: this.page.locator(`text="${text}"`).nth(0) }).nth(0);
      await this.setCssAndXPath(ele);
      return this;
    } else {
      let ele = await this.getHasFrame() ? this.page.frameLocator(this.stringFramelocator).locator(`${await this.getLocator()}:has-text("${text}")`).nth(0) : this.page.locator(`${await this.getLocator()}:has-text("${text}")`).nth(0);
      await this.setCssAndXPath(ele);
      return this;
    }
  }
  async getCss(cssValue) {
    return await this.getPage().then(async () => {
      let locatorE = await this.getElement();
      let jsonVals = await locatorE.evaluate((element) => {
        console.log("getting css.....");
        let json = JSON.parse("{}");
        let cssObj = window.getComputedStyle(element);
        for (let i = 0; i < cssObj.length; i++) {
          json[cssObj[i]] = cssObj.getPropertyValue(cssObj[i]);
        }
        return json;
      });
      await this.clearFullCssAndXPath();
      if (jsonVals[cssValue] !== "") {
        return jsonVals[cssValue];
      } else {
        return "Invalid property";
      }
    });
  }
  async getLocator() {
    return this.fullCss === this.locator ? this.locator : this.fullCss;
  }
  async getLocatorFullCss() {
    return this.fullCss;
  }
  async getLocatorFullXpath() {
    return this.fullXpath;
  }
  async find(locator, options) {
    let _index = options?.index?.valueOf() !== void 0 ? options?.index : 0;
    let _objIndex = options?.nthObj?.valueOf() !== void 0 ? options?.nthObj : 0;
    if (options?.hasText?.valueOf() === void 0) {
      let ele = await this.getHasFrame() ? this.page.frameLocator(this.stringFramelocator).locator(`${await this.getLocator()} ${locator}`).nth(_index) : this.page.locator(`${await this.getLocator()} ${locator}`).nth(_index);
      await this.setCssAndXPath(ele);
    } else {
      let ele = (await this.getElement()).locator(locator, { hasText: `${options.hasText}` }).nth(_index);
      await this.setCssAndXPath(ele);
    }
    if (options?.nthObj?.valueOf() !== void 0) {
      let ele = (await this.getElement()).nth(_objIndex);
      await this.setCssAndXPath(ele);
    }
    return this;
  }
  async setDescription(desc) {
    this.objectDescriptor = desc;
    return this;
  }
  async getTextAllMatchingObjects() {
    let arr = [];
    let count = await (await this.getElement()).count();
    for (let indx = 0; indx < count; indx++) {
      await staticWait(100);
      let iText = (await (await this.getElement()).nth(indx).innerText()).toString();
      arr.push(iText.trim());
    }
    await this.clearFullCssAndXPath();
    return arr;
  }
  async clear(option) {
    let _force = option?.force?.valueOf() !== void 0;
    let ele = await this.getElement();
    await this.setCssAndXPath(ele);
    await ele.clear({ force: _force });
    return this;
  }
  async click(options) {
    let _objIndex = options?.objIndex?.valueOf() === void 0 ? 0 : options?.objIndex;
    let _force = options?.force?.valueOf() !== void 0 ? options?.force : false;
    const obj = (await this.getElement()).nth(_objIndex);
    await obj.click({ force: _force });
    playwrightWrapper.logger.info(`clicked on the ${this.objectDescriptor} of [${_objIndex}]`);
    await this.clearFullCssAndXPath();
  }
  async dblClick(options) {
    let _objIndex = options?.objIndex?.valueOf() === void 0 ? 0 : options?.objIndex;
    let _force = options?.force?.valueOf() !== void 0 ? options?.force : false;
    const obj = (await this.getElement()).nth(_objIndex);
    await obj.dblclick({ force: _force });
    playwrightWrapper.logger.info(`dbl clicked on the ${this.objectDescriptor} of [${_objIndex}`);
    await this.clearFullCssAndXPath();
  }
  async waitForDomComplete(page, pollDelay = 10, stableDelay = 500) {
    let markupPrevious = "";
    const timerStart = /* @__PURE__ */ new Date();
    let isStable = false;
    let counter = 0;
    while (!isStable) {
      ++counter;
      const markupCurrent = await page.evaluate(() => document.body.innerHTML);
      const elapsed = (/* @__PURE__ */ new Date()).getTime() - timerStart.getTime();
      if (markupCurrent == markupPrevious) {
        isStable = stableDelay <= elapsed;
      } else {
        markupPrevious = markupCurrent;
      }
      if (!isStable) {
        await new Promise((resolve) => setTimeout(resolve, pollDelay));
      }
    }
  }
  async getAllObjects(options) {
    if (options?.hasText === void 0) {
      const arrayLocators = await (await this.getElement()).locator(":scope", { has: await this.getHasFrame() ? this.page.frameLocator(this.stringFramelocator).locator(this.locator) : this.page.locator(this.locator) }).all();
      arrayLocators.forEach((loc) => {
        this.tempLocators.push(loc);
      });
    } else {
      const arrayLocators = await (await this.getElement()).locator(this.locator, { hasText: `${options.hasText}` }).all();
      arrayLocators.forEach((loc) => {
        this.tempLocators.push(loc);
      });
    }
    const uiElements = await Promise.all(this.tempLocators.map(async (loc, index) => {
      const cssLocator = (await (0, import_playwright_dompath.cssPath)(loc)).toString();
      return new _UiElement(cssLocator, { description: `${this.objectDescriptor} [${index}]` });
    }));
    return uiElements;
  }
  /*
      async getAllObjects(locator: string, options?: { hasText?: string }) {
  
          if (options?.hasText?.valueOf() === undefined) {
              let arrayLocators = await (await this.getElement()).locator(':scope', { has: this.page.locator(locator) }).all();
              await (await arrayLocators).forEach((loc: Locator) => {
                  this.tempLocators.push(loc);
              })
  
          } else {
              let arrayLocators = await (await this.getElement()).locator(locator, { hasText: `${options.hasText}` }).all();
              await (await arrayLocators).forEach((loc: Locator) => {
                  this.tempLocators.push(loc);
              })
          }
  
          let uiElements: UiElement[];
          this.tempLocators.forEach(async (loc: any, index: number) => {
              let cssLocator = await (await cssPath(loc)).toString();
              let ele = new UiElement(cssLocator, { description: `${this.objectDescriptor} [${index}]` })
              uiElements.push(ele);
          })
          return uiElements;
      }
  */
  async chooseFiles(files) {
    await this.waitTillElementToBeReady().then(async () => {
      await (await this.getElement()).setInputFiles(files);
      await this.waitTillElementToBeReady();
      await this.clearFullCssAndXPath();
    });
  }
  async check(options) {
    let _objIndex = options?.objIndex === void 0 ? 0 : options?.objIndex;
    let _force = options?.force?.valueOf() !== void 0 ? options?.force : false;
    await this.waitTillElementToBeReady().then(async () => {
      const obj = _objIndex > -1 ? (await this.getElement()).nth(_objIndex) : (await this.getElement()).first();
      let flag = await obj.getAttribute("disabled");
      if (!flag) {
        await obj.check({ force: _force });
        playwrightWrapper.logger.info(`${this.objectDescriptor} - checked the checkbox`);
      } else {
        playwrightWrapper.logger.info(`${this.objectDescriptor} - unable to check the checkbox, its disabled`);
      }
      await this.clearFullCssAndXPath();
    });
  }
  async uncheck(options) {
    let _objIndex = options?.objIndex === void 0 ? 0 : options?.objIndex;
    let _force = options?.force?.valueOf() !== void 0 ? options?.force : false;
    const obj = _objIndex > -1 ? (await this.getElement()).nth(_objIndex) : (await this.getElement()).first();
    let flag = await obj.getAttribute("disabled");
    if (!flag) {
      await obj.uncheck({ force: _force });
      playwrightWrapper.logger.info(`${this.objectDescriptor} - unchecked the checkbox`);
    } else {
      playwrightWrapper.logger.info(`${this.objectDescriptor} - unable to uncheck the checkbox, its disabled`);
    }
    await this.clearFullCssAndXPath();
  }
  /*
      Allowed Keys : F1 - F12, Digit0- Digit9, KeyA- KeyZ, Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape, ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight, ArrowUp, etc.     
  */
  async setValue(inputString, options) {
    let _force = options?.force?.valueOf() !== void 0 ? options?.force : false;
    await (await this.getElement()).clear();
    await (await this.getElement()).fill(inputString.toString(), { force: _force });
    if (options?.keyPress?.valueOf() !== void 0) {
      await (await this.getElement()).press(options?.keyPress);
    }
    playwrightWrapper.logger.info(`${this.objectDescriptor} - Set the value -  ${this.objectDescriptor.toLowerCase().includes("password") ? "*******" : inputString}`);
    await this.clearFullCssAndXPath();
  }
  /*
      Allowed Keys : F1 - F12, Digit0- Digit9, KeyA- KeyZ, Backquote, Minus, Equal, Backslash, Backspace, Tab, Delete, Escape, ArrowDown, End, Enter, Home, Insert, PageDown, PageUp, ArrowRight, ArrowUp, etc.
  
  */
  async type(inputString, options) {
    let _delay = options?.delay?.valueOf() !== void 0 ? 0 : options?.delay;
    let _clearAndType = options?.clearAndType?.valueOf() !== void 0 ? false : options?.clearAndType;
    if (_clearAndType) {
      (await this.getElement()).clear({ force: true });
    }
    await (await this.getElement()).type(inputString, { delay: _delay });
    if (options?.keyPress?.valueOf() !== void 0) {
      await (await this.getElement()).press(options?.keyPress);
    }
    playwrightWrapper.logger.info(`${this.objectDescriptor} - Type the value -  ${this.objectDescriptor.toLowerCase().includes("password") ? "*******" : inputString}`);
    await this.clearFullCssAndXPath();
  }
  async pressSequentially(inputString, options) {
    let _delay = options?.delay?.valueOf() !== void 0 ? 0 : options?.delay;
    await (await this.getElement()).pressSequentially(inputString, { delay: _delay });
    if (options?.keyPress?.valueOf() !== void 0) {
      await (await this.getElement()).press(options?.keyPress);
    }
    playwrightWrapper.logger.info(`${this.objectDescriptor} - pressSequentially the value -  ${this.objectDescriptor.toLowerCase().includes("password") ? "*******" : inputString}`);
    await this.clearFullCssAndXPath();
  }
  async selectListOptionByText(option) {
    await (await this.getElement()).selectOption(option);
    playwrightWrapper.logger.info(`${this.objectDescriptor} - Selecting the option : ` + option);
    await this.clearFullCssAndXPath();
  }
  async selectListOptionByIndex(indexOf) {
    await (await this.getElement()).selectOption({ index: indexOf });
    playwrightWrapper.logger.info(`${this.objectDescriptor} - Selecting the option index : ` + indexOf);
    await this.clearFullCssAndXPath();
  }
  async getListOptions() {
    let innerTexts = await this.getHasFrame() ? await this.page.frameLocator(this.stringFramelocator).locator(await this.getLocator() + " option").allInnerTexts() : await this.page.locator(await this.getLocator() + " option").allInnerTexts();
    await this.clearFullCssAndXPath();
    return innerTexts;
  }
  async getSelectedListValue() {
    const selectedOption = await (await this.getElement()).locator(await this.getLocator() + '[aria-selected="true"]').first();
    const value = await selectedOption.innerText();
    await this.clearFullCssAndXPath();
    return value;
  }
  async getUiElement() {
    let ele = await new _UiElement("xpath=" + await this.getLocatorFullXpath());
    this.clearFullCssAndXPath();
    return ele;
  }
  async getColumnHasText(cellvalue) {
    let ele = (await this.getElement()).locator("td").filter({ hasText: `${cellvalue} ` });
    await this.setCssAndXPath(ele);
    return this;
  }
  async waitForRowsToLoad(options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    await (await this.getElement()).locator(_locator).nth(0).waitFor({ state: "attached", timeout: 6e4 });
    return this;
  }
  async waitForHomeTabsToLoad(options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "ecp-ucl-skeleton-loader" : options?.locator;
    await (await this.getElement()).locator(_locator).nth(0).waitFor({ state: "hidden", timeout: 6e4 });
    return this;
  }
  /**
   * The function `getCellData` retrieves the data from a specific cell in a table based on the given
   * row and column indices.
   * @param {number} row - The `row` parameter is the index of the row from which you want to
   * retrieve the cell data. It is a number that represents the position of the row in a table or
   * grid.
   * @param {number} col - The `col` parameter in the `getCellData` function represents the column
   * number of the cell from which you want to retrieve data.
   * @param [options] - The `options` parameter is an optional object that can contain the following
   * properties:
   * @returns the cell data as a string.
   */
  async getCellData(row, col, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    playwrightWrapper.logger.info(`getting cell data from ${this.objectDescriptor} - Row,Column [${row},${col}]`);
    let val = await (await this.getElement()).locator(_locator).nth(row).locator("td").nth(col).innerText();
    await this.clearFullCssAndXPath();
    playwrightWrapper.logger.info(`Row,Column [${row},${col}] = ${val}`);
    return val.toString();
  }
  /**
   * The function `getRowData` retrieves the inner texts of all elements in a specified row of a
   * table.
   * @param {number} row - The `row` parameter is the index of the row you want to retrieve data
   * from. It is a number that represents the position of the row in a table or list.
   * @param [options] - The `options` parameter is an optional object that can contain the following
   * properties:
   * @returns an array of inner texts of elements in a row.
   */
  async getRowData(row, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let arr = await (await this.getElement()).locator(_locator).nth(row).allInnerTexts();
    await this.clearFullCssAndXPath();
    return arr;
  }
  async getRowDataAsArray(row, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let aRow = (await this.getElement()).locator(_locator).nth(row);
    let arr = new Array();
    let columnLenth = await aRow.locator("td").count();
    for (let index = 0; index < columnLenth; index++) {
      let data = await (await aRow.locator("td").nth(index).innerText()).toString();
      arr.push(data);
    }
    await this.clearFullCssAndXPath();
    return arr;
  }
  /**
   * The function `getAllRowsColumnData` retrieves the data from a specific column in a table, with
   * an optional locator parameter to specify the table rows.
   * @param {number} column - The `column` parameter is the index of the column you want to retrieve
   * data from. It is a number that represents the position of the column in the table, starting from
   * 0 for the first column.
   * @param [options] - The `options` parameter is an optional object that can contain the following
   * properties:
   * @returns an array of data from a specific column in a table.
   */
  async getAllRowsColumnData(column, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let arr = [];
    let length = await (await this.getElement()).locator(_locator).count();
    for (let index = 0; index < length; index++) {
      let text = await (await this.getElement()).locator(_locator).nth(index).locator("td").nth(column).innerText();
      arr.push(text);
    }
    await this.clearFullCssAndXPath();
    return arr;
  }
  /**
   * The function retrieves the inner texts of all th elements within a specified element and returns
   * them as an array.
   * @returns an array of header names.
   */
  async getHeaderNames() {
    let arr = await (await this.getElement()).locator("th").allInnerTexts();
    await this.clearFullCssAndXPath();
    return arr;
  }
  /**
   * The function tbody() asynchronously locates the tbody element, sets its CSS and XPath, and
   * returns the coding assistant.
   * @returns This `async tbody()` function is returning the current object (`this`) after setting
   * the CSS and XPath properties of the `tbody` element obtained from the `getElement()` function.
   */
  async tbody() {
    let ele = (await this.getElement()).locator("tbody");
    await this.setCssAndXPath(ele);
    return this;
  }
  /**
   * The above function is an asynchronous method in TypeScript that locates the 'thead' element,
   * sets its CSS and XPath properties, and returns the updated element.
   * @returns The `thead` element is being returned after setting its CSS and XPath properties.
   */
  async thead() {
    let ele = (await this.getElement()).locator("thead");
    await this.setCssAndXPath(ele);
    return this;
  }
  /**
   * The function `getRow` retrieves a specific row element from a table based on the given index and
   * optional locator.
   * @param {number} index - The index parameter is a number that represents the position of the row
   * you want to retrieve. It is used to specify which row to select from a table or list of rows.
   * @param [options] - The `options` parameter is an optional object that can contain the following
   * properties:
   * @returns a Promise that resolves to the current instance of the object.
   */
  async getRow(index, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    return await this.waitTillElementToBeReady().then(async () => {
      let ele = (await this.getElement()).locator(_locator).nth(index);
      await this.setCssAndXPath(ele);
      return this;
    });
  }
  /**
   * The function `getTable` retrieves a table element from the page and sets its CSS and XPath
   * properties.
   * @param [index=0] - The index parameter is used to specify the index of the element to be
   * retrieved from the list of elements. It is an optional parameter with a default value of 0.
   * @returns the current instance of the object.
   */
  async getTable(index = 0) {
    let ele = (await this.getElement()).nth(index);
    await this.setCssAndXPath(ele);
    return this;
  }
  /**
   * The function `getHederColumnNumber` returns the index of a column header in a table based on its
   * name, with an option for exact or case-insensitive matching.
   * @param {string} colName - The `colName` parameter is a string that represents the name of the
   * column you want to find the number of.
   * @param [exactMatch=false] - The `exactMatch` parameter is a boolean value that determines
   * whether the column name should be matched exactly or not. If `exactMatch` is set to `true`, the
   * column name must match exactly (including case sensitivity). If `exactMatch` is set to `false`
   * (or not provided
   * @returns the index of the column header with the specified name.
   */
  async getHederColumnNumber(colName, exactMatch = false) {
    const innerTextArr = await (await this.getElement()).locator("th").allInnerTexts();
    await this.clearFullCssAndXPath();
    if (exactMatch) {
      return innerTextArr.findIndex((ele) => ele.trim() === colName.trim());
    }
    return innerTextArr.findIndex((ele) => ele.trim().toLowerCase() === colName.trim().toLowerCase());
  }
  /**
   * The function `getHeaderName` retrieves the text of a table header element at a specified index.
   * @param {number} index - The `index` parameter is a number that represents the position of the
   * table header element in the table. It is used to specify which table header element to retrieve
   * the name from.
   * @returns the text of the header name at the specified index.
   */
  async getHeaderName(index) {
    let text = await (await this.getElement()).locator("th").nth(index).innerText();
    await this.clearFullCssAndXPath();
    return text;
  }
  /**
   * The function `getHeaderColumnLength` returns the number of header columns in a table after
   * waiting for the element to be ready.
   * @returns the length of the header column.
   */
  async getHeaderColumnLength() {
    return await this.waitTillElementToBeReady().then(async () => {
      let headerCount = Number(await (await this.getElement()).locator("th").count());
      await this.clearFullCssAndXPath();
      return headerCount;
    });
  }
  /**
   * The function returns the number of rows in a table, using a specified locator or the default
   * locator if none is provided.
   * @param [options] - An optional object that can contain the following property:
   * @returns the length of rows in a table.
   */
  async getRowsLength(options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    return await this.waitTillElementToBeReady().then(async () => {
      let ele = await this.getElement();
      await this.setCssAndXPath(ele);
      this.fullCss = this.fullCss + " " + _locator;
      ele = await this.getElement();
      let count = await this.isExist() ? Number(await ele.count()) : 0;
      await this.clearFullCssAndXPath();
      playwrightWrapper.logger.info(`Number of rows in the table = ${count}`);
      return count;
    });
  }
  /**
   * The function `getMetaTableRowsLength` returns the number of rows in a table element.
   * @param [options] - An optional object that can contain the following properties:
   * @returns the length of the table rows that match the specified locator.
   */
  async getMetaTableRowsLength(options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    return await this.waitTillElementToBeReady().then(async () => {
      this.fullCss = (await this.getLocator()).toString() + " tr";
      let length = await this.isExist() ? Number(await (await this.getElement()).locator(_locator).count()) : 0;
      await this.clearFullCssAndXPath();
      return length;
    });
  }
  async getColumnLength(rowIndex, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let rowI = rowIndex ?? 0;
    let length = Number(await (await this.getElement()).locator(_locator).nth(rowI).locator("td").count());
    await this.clearFullCssAndXPath();
    return length;
  }
  async getRowColumn(rowIndex, columnIndex, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let rowColumn = (await this.getElement()).locator(_locator).nth(rowIndex).locator("td").nth(columnIndex);
    await this.setCssAndXPath(rowColumn);
    return this;
  }
  /**
   * The `getMatchedRowIndex` function is an asynchronous function that takes an array of row values
   * and an optional options object as parameters, and returns the index of the first row that
   * matches the given values in a table.
   * @param {string[]} rowValues - An array of string values representing the values to match in each
   * row of a table.
   * @param [options] - The `options` parameter is an optional object that can contain the following
   * properties:
   * @returns a Promise that resolves to the index of the matched row in the table. If a match is
   * found, it returns the index of the row. If no match is found, it returns -1.
   */
  async getMatchedRowIndex(rowValues, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let _exactMatch = options?.exactMatch?.valueOf() === void 0 ? false : options?.exactMatch;
    let arr = new Array();
    rowValues.forEach((ele, i) => {
      rowValues[i] = ele.trim().includes(`'`) ? ele.trim().split(`'`)[1] : ele.trim();
    });
    return await this.waitTillElementToBeReady().then(async () => {
      await (await this.getElement()).locator(_locator).nth(0).waitFor();
      const rows = await (await this.getElement()).locator(_locator).count();
      for (let index = 0; index < rows; index++) {
        const table_data = await (await this.getElement()).locator(_locator).nth(index).allInnerTexts();
        let rowdata = table_data.toString().split("	").join("").split("\n");
        playwrightWrapper.logger.info(`Actual Row data = ${rowdata}`);
        if (rowdata.length > 1) {
          arr.push(rowdata);
        }
      }
      let row_index = arr.findIndex((row_text) => {
        for (const col_data of rowValues) {
          if (_exactMatch) {
            if (row_text.findIndex((ele) => ele.trim().toLowerCase() === col_data.toLowerCase().trim()) < 0) return false;
          } else if (row_text.findIndex((ele) => ele.trim().toLowerCase().includes(col_data.toLowerCase().trim())) < 0) return false;
        }
        return true;
      });
      await this.clearFullCssAndXPath();
      if (row_index >= 0) {
        return row_index;
      }
      return -1;
    });
  }
  /**
   * The function `getMatchedRowIndices` is an asynchronous function that takes an array of row
   * values and an optional options object as parameters, and returns an array of indices of rows
   * that match the given values.
   * @param {string[]} rowValues - An array of string values representing the values to match in each
   * row.
   * @param [options] - The `options` parameter is an optional object that can contain two
   * properties:
   * @returns an array of indices that match the specified row values.
   */
  async getMatchedRowIndices(rowValues, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let _exactMatch = options?.exactMatch?.valueOf() === void 0 ? false : options?.exactMatch;
    rowValues.forEach((ele, i) => {
      rowValues[i] = ele.trim().includes(`'`) ? ele.trim().split(`'`)[1] : ele.trim();
    });
    let foundIndices = new Array();
    const nRows = await (await this.getElement()).count();
    for (let index = 0; index < nRows; index++) {
      await (await this.getElement()).locator(_locator).nth(index).allInnerTexts().then(async (row_text) => {
        let row_text_arr = row_text.toString().split("\n");
        for (const col_data of rowValues) {
          if (_exactMatch) {
            if (row_text_arr.findIndex((ele) => ele.trim().toLowerCase() === col_data.toLowerCase().trim()) < 0) return false;
          } else if (row_text_arr.findIndex((ele) => ele.trim().toLowerCase().includes(col_data.toLowerCase().trim())) < 0) return false;
        }
        return true;
      }).then((flag) => {
        if (flag) {
          foundIndices.push(index);
        }
      });
    }
    await this.clearFullCssAndXPath();
    return foundIndices;
  }
  /**
   * The function `getMetaTableMatchedRowIndex` is an asynchronous function that searches for a row
   * in a table based on the provided row values and returns the index of the matched row.
   * @param {string[]} rowValues - An array of string values representing the values to match in each
   * row of the table.
   * @param [options] - The `options` parameter is an optional object that can contain the following
   * properties:
   * @returns the index of the matched row in the meta table. If a match is found, it returns the
   * index of the row. If no match is found, it returns -1.
   */
  async getMetaTableMatchedRowIndex(rowValues, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let _exactMatch = options?.exactMatch?.valueOf() === void 0 ? false : options?.exactMatch;
    let arr = new Array();
    await (await this.getElement()).locator(_locator).nth(0).waitFor();
    rowValues.forEach((ele, i) => {
      rowValues[i] = ele.trim();
    });
    const rows = await (await this.getElement()).locator(_locator).count();
    for (let index = 0; index < rows; index++) {
      const table_data = await (await this.getElement()).locator(_locator).nth(index).allInnerTexts();
      let rowdata = table_data.toString().split("	").join("").split("\n");
      if (rowdata.length > 1) {
        arr.push(rowdata);
      }
    }
    let row_index = arr.findIndex((row_text) => {
      for (const col_data of rowValues) {
        if (_exactMatch) {
          if (row_text.findIndex((ele) => ele.trim().toLowerCase() === col_data.toLowerCase().trim()) < 0) return false;
        } else if (row_text.findIndex((ele) => ele.trim().toLowerCase().includes(col_data.toLowerCase().trim())) < 0) return false;
      }
      return true;
    });
    await this.clearFullCssAndXPath();
    if (row_index >= 0) {
      return row_index;
    }
    return -1;
  }
  async getMetaTableMatchedRowIndices(rowValues, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let _exactMatch = options?.exactMatch?.valueOf() === void 0 ? false : options?.exactMatch;
    let _minColumnSize = options?.minColumnSize?.valueOf() === void 0 ? 1 : options?.minColumnSize;
    console.log("Recieved data : " + rowValues);
    let arr = new Array();
    let foundIndices = new Array();
    let rows = await (await this.getElement()).locator(_locator).all();
    rowValues.forEach((ele, i) => {
      rowValues[i] = ele.trim().includes(`'`) ? ele.trim().split(`'`)[1] : ele.trim();
    });
    console.log(rowValues);
    for (let row of rows) {
      let arrTds = new Array();
      let cols = await row.locator("td").all();
      for (let col of cols) {
        arrTds.push((await col.innerText()).toString().trim());
      }
      if (arrTds.length > _minColumnSize)
        arr.push(arrTds);
    }
    for (const element of arr) {
      let row_index = arr.findIndex((row_text) => {
        for (const col_data of rowValues) {
          if (_exactMatch) {
            if (row_text.findIndex((ele) => ele.trim().toLowerCase() === col_data.toLowerCase().trim()) < 0) return false;
          } else if (row_text.findIndex((ele) => ele.trim().toLowerCase().includes(col_data.toLowerCase().trim())) < 0) return false;
        }
        return true;
      });
      if (row_index >= 0) {
        arr[row_index] = [];
        foundIndices.push(row_index);
      }
    }
    return foundIndices;
  }
  async clickMetaTableRowLink(rowIndex, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let _linkName = options?.linkName?.valueOf() === void 0 ? false : options?.linkName;
    let _lnkIndex = options?.lnkIndex?.valueOf() === void 0 ? -1 : options?.lnkIndex;
    const row = (await this.getElement()).nth(rowIndex).locator(_locator).nth(0);
    const temp = _lnkIndex > -1 ? row.locator("a").nth(_lnkIndex - 1) : row.locator("a").first();
    const link = _linkName !== "" ? row.filter({ hasText: `${_linkName}` }) : temp;
    await link.click();
    await this.clearFullCssAndXPath();
  }
  async clickRowByLinkName(rowIndex, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let _linkName = options?.linkName?.valueOf() === void 0 ? false : options?.linkName;
    let _lnkIndex = options?.lnkIndex?.valueOf() === void 0 ? -1 : options?.lnkIndex;
    const row = (await this.getElement()).locator(_locator).nth(rowIndex);
    const temp = _lnkIndex > -1 ? row.locator("a").nth(_lnkIndex - 1) : row.locator("a").first();
    const link = _linkName !== "" ? row.filter({ hasText: `${_linkName}` }) : temp;
    await link.click();
    await this.clearFullCssAndXPath();
  }
  async isColumnValueExist(colValue) {
    let exist = await (await this.getElement()).locator("td").filter({ hasText: `${colValue} ` }).count() > 0;
    await this.clearFullCssAndXPath();
    return exist;
  }
  async clickRowLink(rowIndex, options) {
    let _lIndex = options?.linkIndex?.valueOf() !== void 0 ? options?.linkIndex?.valueOf() : 0;
    let _force = options?.force?.valueOf() !== void 0 ? options?.force?.valueOf() : false;
    const row = await this.getHasFrame() ? this.page.frameLocator(this.stringFramelocator).locator(await this.getLocator() + " tr").nth(rowIndex) : this.page.locator(await this.getLocator() + " tr").nth(rowIndex);
    await row.locator("a").nth(_lIndex).click({ force: _force });
    await this.clearFullCssAndXPath();
  }
  async metaTableClickRowLink(rowIndex, options) {
    let _locator = options?.locator?.valueOf() === void 0 ? "tr" : options?.locator;
    let _lnkIndex = options?.lnkIndex?.valueOf() === void 0 ? -1 : options?.lnkIndex;
    const row = (await this.getElement()).nth(rowIndex).locator(_locator).nth(0);
    if (await row.getByRole("link").nth(_lnkIndex).isEnabled()) {
      await row.getByRole("link").nth(_lnkIndex).click();
    } else {
      playwrightWrapper.logger.error(_locator + " text row is not enabled");
    }
    await this.clearFullCssAndXPath();
  }
};
var playwrightWrapper = {
  // @ts-ignore
  page: void 0,
  apiContext: void 0,
  popup: void 0,
  newPage: void 0,
  context: void 0,
  browser: void 0,
  logger: import_test_automation_library.customLogger,
  commonFrameLocator: void 0
};
var invokeBrowser = async (browserType, options) => {
  console.log("in invoke browser : " + browserType);
  let _headless = options?.headless?.valueOf() === void 0 ? true : options?.headless?.valueOf();
  let _channel = options?.channel?.valueOf() !== void 0 ? options?.channel?.valueOf() : "";
  switch (browserType) {
    case "chrome":
      return await import_test.chromium.launch({ headless: _headless });
    case "firefox":
      return await import_test.firefox.launch({ headless: _headless });
    case "webkit":
      return await import_test.webkit.launch({ headless: _headless });
    case "msedge":
      return await import_test.chromium.launch({
        channel: "msedge",
        headless: _headless
      });
    default:
      return await import_test.chromium.launch({ headless: _headless });
  }
};
async function waitForPageLoad() {
  await playwrightWrapper.page.waitForLoadState("domcontentloaded");
  await playwrightWrapper.page.waitForLoadState();
  return true;
}
async function waitForUrl(url) {
  playwrightWrapper.logger.info(" Waiting for the URL : " + url);
  await playwrightWrapper.page.waitForURL(url, { timeout: 12e4, waitUntil: "domcontentloaded" });
}
async function waitForSpinnerHidden() {
  let _locator = ".spinner";
  await playwrightWrapper.page.locator(_locator).nth(0).waitFor({ state: "hidden", timeout: 6e4 });
}
async function staticWait(timeOut, isPage = true, waitForSpinner = true) {
  if (isPage) {
    playwrightWrapper.logger.info(`Waiting for the page : ${timeOut} milliseconds`);
    if (waitForSpinner) {
      await waitForSpinnerHidden();
    }
    await playwrightWrapper.page.waitForTimeout(timeOut);
  } else {
    playwrightWrapper.logger.info(`Waiting for the popup : ${timeOut} milliseconds`);
    await playwrightWrapper.popup.waitForTimeout(timeOut);
  }
}
async function gotoUrl(url) {
  await playwrightWrapper.page.route("**/*.{png,jpg,jpeg}", (route) => route.abort());
  await playwrightWrapper.page.goto(url, { timeout: 5e5, waitUntil: "domcontentloaded" });
  playwrightWrapper.logger.info("Launching URL : " + url);
}
async function closeplaywrightWrapper() {
  if (playwrightWrapper.popup !== void 0) {
    await playwrightWrapper.popup.close();
  }
  if (playwrightWrapper.page) {
    await playwrightWrapper.page.close();
  }
}
async function getUrl(pageIndex = 0) {
  const pages = playwrightWrapper.context.pages();
  const page = pages[pageIndex];
  await waitForPageLoad();
  return page.url().toString();
}
async function pause(options) {
  let _flag = options?.isPage?.valueOf() === void 0 ? true : options?.isPage?.valueOf();
  if (_flag) {
    await playwrightWrapper.page.pause();
  } else {
    await playwrightWrapper.popup.pause();
  }
}
async function refreshPage(options) {
  let _flag = options?.isPage?.valueOf() === void 0 ? true : options?.isPage?.valueOf();
  if (_flag) {
    await playwrightWrapper.page.reload();
  } else {
    await playwrightWrapper.popup.reload();
  }
}
async function getApiResponse(url) {
  const response = await playwrightWrapper.page.waitForResponse((response2) => response2.url().includes(url));
  return response;
}
async function loopThroughElementsAndClick(locatorVal, index = 0, action = "click") {
  const allElements = await playwrightWrapper.page.locator(locatorVal).all();
  let count = 0;
  for (let locElement of allElements) {
    if (count === index) {
      action.toLowerCase() === "click" ? await locElement.click() : await locElement.innerText();
      return locElement;
    }
    count++;
  }
}
async function keyboard(method, key, options) {
  let _isPage = options?.isPage?.valueOf() === void 0 ? true : options?.isPage;
  let _pageIndex = options?.pageIndex?.valueOf() === void 0 ? 0 : options?.pageIndex;
  let page;
  if (_isPage !== true) {
    if (playwrightWrapper.popup === void 0) {
      const [newPopup] = await Promise.all([
        playwrightWrapper.page.waitForEvent("popup")
      ]);
      playwrightWrapper.popup = newPopup;
      ;
    }
    page = playwrightWrapper.popup;
  } else {
    const pages = playwrightWrapper.context.pages();
    page = pages[_pageIndex];
  }
  key = key.charAt(0).toUpperCase() + key.slice(1);
  playwrightWrapper.logger.info(`Keybaord method : ${method} - ${key}`);
  switch (method.toLowerCase().trim()) {
    case "type":
      await page.keyboard.type(key);
      return;
    case "up":
      await page.keyboard.up(key);
      return;
    case "down":
      await page.keyboard.down(key);
      return;
    case "press":
      await page.keyboard.press(key);
      return;
    case "inserttext":
      await page.keyboard.insertText(key);
      return;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UiElement,
  closeplaywrightWrapper,
  getApiResponse,
  getUrl,
  gotoUrl,
  invokeBrowser,
  keyboard,
  loopThroughElementsAndClick,
  pause,
  playwrightWrapper,
  refreshPage,
  staticWait,
  waitForPageLoad,
  waitForSpinnerHidden,
  waitForUrl
});
