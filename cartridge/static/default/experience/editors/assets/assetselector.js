(() => {
  /** The main Editor element to be tinkered with */
  var rootEditorElement;
  var control;

  /**
  * Create an option element to shorten the api-calls, as this is called twice.
  * @param {string} text The text to show in the select box
  */
  function placeHolderOption(text) {
    const optionElement = document.createElement('option');
    optionElement.selected = 'selected';
    optionElement.disabled = 'disabled';
    optionElement.hidden = 'hidden';
    optionElement.value = '';
    optionElement.innerHTML = text;
    return optionElement;
  }

  function querySelector(selector) {
    return rootEditorElement.querySelector(selector);
  }

  /**
  * initializes the base markup before page is ready. This is not part of the API, and called explicitely at the end of this module.
  */
  function init() {
    rootEditorElement = document.createElement('div');
    rootEditorElement.innerHTML = `
        <div class="slds-box slds-grid slds-wrap" style="min-height: 300px">
            <div class="slds-p-around_xxx-small slds-size_2-of-2 slds-form-element__control">
              <label for="content-asset-id" class="slds-form-element__label">Content Asset ID</label>
              <select id="content-asset-id" placeholder="Pick a content asset...">
              </select>

              <div style="display: none;">
                <label for="linkTab-selector" class="slds-form-element__label">Link Type</label>
                <div class="slds-select_container">
                    <select name="linkTab-selector" class="slds-select linkTab-selection">
                    </select>
                </div>
              </div>
            </div>
        </div>
        `;
    // show "Loading.. "
    // loadingPlaceHolder = placeHolderOption('Loading...');
    querySelector('.linkTab-selection').appendChild(placeHolderOption('Loading...'));

    document.body.appendChild(rootEditorElement);
  }

  /** the page designer signals readiness to show this editor and provides an optionally pre selected value */
  listen('sfcc:ready', async ({ value, config, isDisabled, isRequired, dataLocale, displayLocale }) => {
    const options =  JSON.parse(config.assets || '[]');
    const savedValue = value ? value.value : '';

    control = new TomSelect('#content-asset-id',{
      maxItems: 1,
      options: options,
      valueField: 'value',
	    labelField: 'text',
      searchField: 'text',
      create: false,
      onInitialize: function () {
        if (savedValue) {
          this.setValue(savedValue, true);
        }
      },
      onChange: function (value) {
        emit({ type: 'sfcc:interacted' });

        emit({
          type: 'sfcc:value',
          payload: value ? JSON.stringify({ value: value }) : null
        });
      }
    });
  });

  // When a value was selected
  listen('sfcc:value', value => { });
  // When the editor must require the user to select something
  listen('sfcc:required', value => { });
  // When the editor is asked to disable its controls
  listen('sfcc:disabled', value => {
    if (value) {
      control.disable();
    } else {
      control.enable();
    }
  });

  init();
})();

