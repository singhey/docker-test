const SearchPage = require("../pageobjects/search.page")
const TestConfig = require("../test-config/DockerSearchPage")


describe('Docker search page validations', () => {

    it('Default tab should be container', async() => {
        await SearchPage.open();
        await browser.pause(10000)
        await expect(await SearchPage.getCurrentActiveTab())
            .toEqual(TestConfig.defaultTab);
    })

    it('Verify there are 2 checkboxes under Images', async() => {
        await expect(await SearchPage.getItemsUnderImages())
            .toEqual(expect.arrayContaining(TestConfig.checkboxesPresent))
    })

    it('Verify labels under Categories', async() => {
        await expect(await SearchPage.getItemsUnderCategories())
            .toEqual(expect.arrayContaining(TestConfig.itemsUnderCategories))
    })

    it('Click on filter', async() => {
        await expect(await SearchPage.clickItemUnderImages(TestConfig.filterImages))
            .toEqual(true)
        await expect(await SearchPage.clickItemUnderDatabse(TestConfig.filterCategories))
            .toEqual(true)
    })

    it("check filters are present at top", async() => {
        await expect(await SearchPage.verifyLabelsAreAddedInSearchFilter(TestConfig.filtersAtTop))
            .toEqual(true)
    })

    it("remove filter from top", async() => {
        await expect(await SearchPage.verifyLabelIsRemovedOnCancel(TestConfig.removeFilter))
            .toEqual(true)

        await expect(await SearchPage.itemsChecked(TestConfig.filtersRemaining))
            .toEqual(true)
    })
})