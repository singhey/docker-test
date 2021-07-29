const Page = require("./page")

class SearchPage extends Page {

    get categoryFilterContainer(){return $("#categoriesFilterList")}
    get imageFilterList(){return $('#imageFilterList')}
    get filterChipContainer(){ return $('div[data-testid="currentFilters"]') }
    get filterChips(){return $$('div[data-testid="currentFilters"] > div') }

    getCurrentActiveTab = async () => {

        return browser.execute(function () {
            const buttons = document.querySelectorAll("div[data-testid='tabs'] > button")
            for(let i = 0; i < buttons.length; i++) {
                if(buttons[i].selected) {
                    return buttons[i].innerText
                }
            }

        })
    }

    getItemsUnderImages = async () => {
        const labelItems = await (await this.imageFilterList).$$("label > span")
        return Promise.all(labelItems.map(async l => await l.getText()))
    }

    getItemsUnderCategories = async () => {
        const labels = await (await this.categoryFilterContainer).$$("label")
        return await Promise.all(labels.map(async l => await l.getText()))
    }

    clickOnFilter = async (rows, matchWith, selectorHeirarchy="label") => {
        let _match = []
        if(typeof matchWith === "string") {
            _match = [matchWith.toLowerCase()]
        }else if(typeof matchWith === "object") {
            _match = matchWith.map(m => {
                return m.toLowerCase()
            })
        }

        let elementsToMatch = _match.length


        for(let i = 0; i < rows.length; i++) {
            const el = await rows[i].$(selectorHeirarchy)
            if(el === null) {
                return false
            }
            const label = await el.getText()
            if(_match.indexOf(label.toLowerCase()) === -1) {
                continue
            }
            console.log(`Clicking element with label ${label}`)
            elementsToMatch -= 1
            const input  = await rows[i].$("input")
            await input.click()
        }
        return elementsToMatch === 0
    }

    clickItemUnderImages = async(matchWith) => {
        const rows = await (await this.imageFilterList).$$(".checkbox")
        return this.clickOnFilter(rows, matchWith, "label span")
    }

    clickItemUnderDatabse = async(matchWith) => {
        const rows = await (await this.categoryFilterContainer).$$(".checkbox")
        return this.clickOnFilter(rows, matchWith)
    }

    labelsPresentInFilter = async() => {
        const filtersApplied = await this.filterChips
        return await Promise.all(filtersApplied.map(l => l.getText()))
    }

    verifyLabelsAreAddedInSearchFilter = async(labelsToBePresent) => {
        const labels = await this.labelsPresentInFilter()
        for(let i = 0; i < labels.length; i++) {
            if(labelsToBePresent.indexOf(labels[i].toLowerCase()) === -1) {
                return false
            }
        }
        return labels.length === labelsToBePresent.length
    }

    removeFilter = async (labelToRemove) => {
        const filters = await this.filterChips
        console.log("Remove filter", filters.length)
        for(let i = 0; i < filters.length; i++) {
            const l = await filters[i].getText()
            console.log(l, labelToRemove)
            if(labelToRemove.toLowerCase() === l.toLowerCase()){
                const svg = await filters[i].$("svg")
                await svg.click()
                return true
            }
        }
        return false
    }

    verifyLabelIsRemovedOnCancel = async (labelsToRemove) => {
        const labelsPresent = await this.labelsPresentInFilter()
        for(let i = 0; i < labelsToRemove.length; i++) {
            const filterRemoved = await this.removeFilter(labelsToRemove[i])
            if(!filterRemoved){
                return false
            }
        }
        const afterRemoval = await this.labelsPresentInFilter()
        return (labelsPresent.length - labelsToRemove.length) === (afterRemoval.length)
    }

    itemsCheckedInFilterSection = async(rows, selectorHeirarchy="label") => {
        
        const checkedLabels = (await Promise.all(
            rows.map(async row => {
                const selected = await (await row.$("input")).isSelected()
                if(selected) {
                    return ({
                        selected: true,
                        label: await (await row.$(selectorHeirarchy)).getText()
                    })
                }
                return ({selected: false})
            })
        )).filter(r => r.selected)
        return checkedLabels
    }

    itemsChecked = async(filtersToRemain) => {
        const [images, categories] = await Promise.all([(await this.imageFilterList).$$(".checkbox"), (await this.categoryFilterContainer).$$(".checkbox")])
        // const images = await (await this.imageFilterList).$$(".checkbox")
        // const categories = await (await this.categoryFilterContainer).$$(".checkbox")
        const labels = await Promise.all([
            this.itemsCheckedInFilterSection(images, "label span"),
            this.itemsCheckedInFilterSection(categories)
        ])
        for(let i = 0; i < labels.length; i++) {
            for(let j = 0; j < labels[i].length; j++) {
                if(filtersToRemain.indexOf(labels[i][j].label.toLowerCase()) === -1){
                    return false
                }
            }
        }
        return true
    }

    open (){
        return super.open("search")
    }
}

module.exports = new SearchPage();