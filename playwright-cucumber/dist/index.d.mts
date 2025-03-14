import * as playwright_core from 'playwright-core';
import { Page, Locator, FrameLocator, APIRequestContext, BrowserContext, Browser } from '@playwright/test';
import { customLogger } from '@qe-solutions/test-automation-library';

declare class UiElement {
    protected locator: string;
    protected page: Page;
    protected objectDescriptor: string;
    protected isPopupExist: boolean;
    protected pageIndex: number;
    protected fullCss: string;
    protected fullXpath: string;
    protected tempLocator: Locator;
    protected tempLocators: Locator[];
    protected hasFrame: boolean;
    protected frameLocator: FrameLocator;
    protected stringFramelocator: string;
    constructor(locator: string, options?: {
        description?: string;
        isPopup?: boolean;
        pageIndex?: number;
        frameLocator?: string;
    });
    protected getPage(): Promise<void>;
    switchPage(pageIndex: number): Promise<this>;
    setFrameLocator(loc: any): Promise<void>;
    setHasFrame(flag: boolean): Promise<void>;
    getHasFrame(): Promise<boolean>;
    setLocator(locator: string, options?: {
        description?: string;
    }): Promise<this>;
    clickToOpenPopup(options?: {
        force?: boolean;
    }): Promise<void>;
    protected getElements(): Promise<Locator[]>;
    protected getElement(): Promise<Locator>;
    protected setCssAndXPath(element: Locator): Promise<void>;
    clickLink(linkName: string, options?: {
        linkNameExactMatch?: boolean;
        force?: boolean;
    }): Promise<void>;
    clickLastLink(options?: {
        force?: boolean;
    }): Promise<void>;
    clickFirstLink(options?: {
        force?: boolean;
    }): Promise<void>;
    getSibling(locator: string, nthElement?: number): Promise<this>;
    getNextSibling(tagName: string): Promise<this>;
    getNextNthSibling(tagName: string, next?: number): Promise<this>;
    getParent(): Promise<this>;
    getNth(index: number): Promise<this>;
    getCount(): Promise<number>;
    getPageObject(index: number): Promise<Locator>;
    mouseHover(): Promise<void>;
    getObject(index: number): Promise<this>;
    getValue(options?: {
        index: number;
    }): Promise<string>;
    getPropertyValue(property: string, options?: {
        index: number;
    }): Promise<string>;
    contains(containsText: string, options?: {
        index?: number;
        locator?: string;
    }): Promise<this>;
    hasText(containsText: string, exactMatch?: boolean, options?: {
        index?: number;
    }): Promise<this>;
    protected clearFullCssAndXPath(): Promise<this>;
    containsClick(containsText: string, options?: {
        force?: boolean;
        index?: number;
    }): Promise<void>;
    waitTillElementToBeReady(): Promise<void>;
    getText(index?: number): Promise<string>;
    getCurrentObject(): Promise<this>;
    getPageTitle(): Promise<string>;
    isExist(): Promise<boolean>;
    isEnabled(): Promise<boolean>;
    isDisabled(): Promise<boolean>;
    isChecked(): Promise<boolean>;
    isVisible(): Promise<boolean>;
    scrollIntoView(options?: string): Promise<void>;
    scrollToBottomOfPage(count?: number): Promise<void>;
    scrollToStartOfPage(count?: number): Promise<void>;
    childHasText(text: string, options?: {
        exactMatch?: boolean;
    }): Promise<this>;
    getCss(cssValue: string): Promise<any>;
    protected getLocator(): Promise<string>;
    getLocatorFullCss(): Promise<string>;
    getLocatorFullXpath(): Promise<string>;
    find(locator: string, options?: {
        index?: number;
        hasText?: string;
        nthObj?: number;
    }): Promise<this>;
    setDescription(desc: string): Promise<this>;
    getTextAllMatchingObjects(): Promise<string[]>;
    clear(option?: {
        force?: boolean;
    }): Promise<this>;
    click(options?: {
        objIndex?: number;
        force?: boolean;
    }): Promise<void>;
    dblClick(options?: {
        objIndex?: number;
        force?: boolean;
    }): Promise<void>;
    waitForDomComplete(page: Page, pollDelay?: number, stableDelay?: number): Promise<void>;
    getAllObjects(options?: {
        hasText?: string;
    }): Promise<UiElement[]>;
    chooseFiles(files: string[]): Promise<void>;
    check(options?: {
        objIndex?: number;
        force?: boolean;
    }): Promise<void>;
    uncheck(options?: {
        objIndex?: number;
        force?: boolean;
    }): Promise<void>;
    setValue(inputString: any, options?: {
        keyPress?: string;
        force?: boolean;
    }): Promise<void>;
    type(inputString: string, options?: {
        delay?: number;
        keyPress?: string;
        clearAndType?: boolean;
    }): Promise<void>;
    pressSequentially(inputString: any, options?: {
        delay?: number;
        keyPress?: string;
    }): Promise<void>;
    selectListOptionByText(option: string): Promise<void>;
    selectListOptionByIndex(indexOf: number): Promise<void>;
    getListOptions(): Promise<string[]>;
    getSelectedListValue(): Promise<string>;
    getUiElement(): Promise<UiElement>;
    getColumnHasText(cellvalue: string): Promise<this>;
    waitForRowsToLoad(options?: {
        locator?: string;
    }): Promise<this>;
    waitForHomeTabsToLoad(options?: {
        locator?: string;
    }): Promise<this>;
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
    getCellData(row: number, col: number, options?: {
        locator?: string;
    }): Promise<string>;
    /**
     * The function `getRowData` retrieves the inner texts of all elements in a specified row of a
     * table.
     * @param {number} row - The `row` parameter is the index of the row you want to retrieve data
     * from. It is a number that represents the position of the row in a table or list.
     * @param [options] - The `options` parameter is an optional object that can contain the following
     * properties:
     * @returns an array of inner texts of elements in a row.
     */
    getRowData(row: number, options?: {
        locator?: string;
    }): Promise<string[]>;
    getRowDataAsArray(row: number, options?: {
        locator?: string;
    }): Promise<any[]>;
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
    getAllRowsColumnData(column: number, options?: {
        locator?: string;
    }): Promise<string[]>;
    /**
     * The function retrieves the inner texts of all th elements within a specified element and returns
     * them as an array.
     * @returns an array of header names.
     */
    getHeaderNames(): Promise<string[]>;
    /**
     * The function tbody() asynchronously locates the tbody element, sets its CSS and XPath, and
     * returns the coding assistant.
     * @returns This `async tbody()` function is returning the current object (`this`) after setting
     * the CSS and XPath properties of the `tbody` element obtained from the `getElement()` function.
     */
    tbody(): Promise<this>;
    /**
     * The above function is an asynchronous method in TypeScript that locates the 'thead' element,
     * sets its CSS and XPath properties, and returns the updated element.
     * @returns The `thead` element is being returned after setting its CSS and XPath properties.
     */
    thead(): Promise<this>;
    /**
     * The function `getRow` retrieves a specific row element from a table based on the given index and
     * optional locator.
     * @param {number} index - The index parameter is a number that represents the position of the row
     * you want to retrieve. It is used to specify which row to select from a table or list of rows.
     * @param [options] - The `options` parameter is an optional object that can contain the following
     * properties:
     * @returns a Promise that resolves to the current instance of the object.
     */
    getRow(index: number, options?: {
        locator?: string;
    }): Promise<this>;
    /**
     * The function `getTable` retrieves a table element from the page and sets its CSS and XPath
     * properties.
     * @param [index=0] - The index parameter is used to specify the index of the element to be
     * retrieved from the list of elements. It is an optional parameter with a default value of 0.
     * @returns the current instance of the object.
     */
    getTable(index?: number): Promise<this>;
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
    getHederColumnNumber(colName: string, exactMatch?: boolean): Promise<number>;
    /**
     * The function `getHeaderName` retrieves the text of a table header element at a specified index.
     * @param {number} index - The `index` parameter is a number that represents the position of the
     * table header element in the table. It is used to specify which table header element to retrieve
     * the name from.
     * @returns the text of the header name at the specified index.
     */
    getHeaderName(index: number): Promise<string>;
    /**
     * The function `getHeaderColumnLength` returns the number of header columns in a table after
     * waiting for the element to be ready.
     * @returns the length of the header column.
     */
    getHeaderColumnLength(): Promise<number>;
    /**
     * The function returns the number of rows in a table, using a specified locator or the default
     * locator if none is provided.
     * @param [options] - An optional object that can contain the following property:
     * @returns the length of rows in a table.
     */
    getRowsLength(options?: {
        locator?: string;
    }): Promise<number>;
    /**
     * The function `getMetaTableRowsLength` returns the number of rows in a table element.
     * @param [options] - An optional object that can contain the following properties:
     * @returns the length of the table rows that match the specified locator.
     */
    getMetaTableRowsLength(options?: {
        locator?: string;
    }): Promise<number>;
    getColumnLength(rowIndex?: number, options?: {
        locator?: string;
    }): Promise<number>;
    getRowColumn(rowIndex: number, columnIndex: number, options?: {
        locator?: string;
    }): Promise<this>;
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
    getMatchedRowIndex(rowValues: string[], options?: {
        locator?: string;
        exactMatch?: boolean;
    }): Promise<number>;
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
    getMatchedRowIndices(rowValues: string[], options?: {
        locator?: string;
        exactMatch?: boolean;
    }): Promise<any[]>;
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
    getMetaTableMatchedRowIndex(rowValues: string[], options?: {
        locator?: string;
        exactMatch?: boolean;
    }): Promise<number>;
    getMetaTableMatchedRowIndices(rowValues: string[], options?: {
        locator?: string;
        exactMatch?: boolean;
        minColumnSize: number;
    }): Promise<any[]>;
    clickMetaTableRowLink(rowIndex: number, options?: {
        linkName?: string;
        lnkIndex?: number;
        locator?: string;
    }): Promise<void>;
    clickRowByLinkName(rowIndex: number, options?: {
        linkName?: string;
        lnkIndex?: number;
        locator?: string;
    }): Promise<void>;
    isColumnValueExist(colValue: string): Promise<boolean>;
    clickRowLink(rowIndex: number, options?: {
        linkIndex?: number;
        force?: boolean;
        locator?: string;
    }): Promise<void>;
    metaTableClickRowLink(rowIndex: number, options?: {
        locator?: string;
        lnkIndex?: number;
    }): Promise<void>;
}
declare const playwrightWrapper: {
    page: Page;
    apiContext: APIRequestContext;
    popup: Page;
    newPage: Page;
    context: BrowserContext;
    browser: Browser;
    logger: typeof customLogger;
    commonFrameLocator: string;
};
declare const invokeBrowser: (browserType: string, options?: {
    headless?: boolean;
    channel?: string;
}) => Promise<Browser>;
declare function waitForPageLoad(): Promise<boolean>;
declare function waitForUrl(url: string): Promise<void>;
declare function waitForSpinnerHidden(): Promise<void>;
declare function staticWait(timeOut: number, isPage?: boolean, waitForSpinner?: boolean): Promise<void>;
declare function gotoUrl(url: string): Promise<void>;
declare function closeplaywrightWrapper(): Promise<void>;
declare function getUrl(pageIndex?: number): Promise<string>;
declare function pause(options?: {
    isPage?: boolean;
}): Promise<void>;
declare function refreshPage(options?: {
    isPage?: boolean;
}): Promise<void>;
declare function getApiResponse(url: string): Promise<playwright_core.Response>;
declare function loopThroughElementsAndClick(locatorVal: any, index?: Number, action?: string): Promise<Locator | undefined>;
declare function keyboard(method: string, key: string, options?: {
    isPage?: boolean;
    pageIndex?: number;
}): Promise<void>;

export { UiElement, closeplaywrightWrapper, getApiResponse, getUrl, gotoUrl, invokeBrowser, keyboard, loopThroughElementsAndClick, pause, playwrightWrapper, refreshPage, staticWait, waitForPageLoad, waitForSpinnerHidden, waitForUrl };
