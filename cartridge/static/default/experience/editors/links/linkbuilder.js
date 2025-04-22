(() => {
  /** The main Editor element to be tinkered with */
  var rootEditorElement;

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
        <div class="slds-box slds-grid slds-wrap">
            <div class="slds-p-around_xxx-small slds-size_2-of-2 slds-form-element__control">
                <label for="linkTab-selector" class="slds-form-element__label">Link Type</label>
                <div class="slds-select_container">
                    <select name="linkTab-selector" class="slds-select linkTab-selection">
                    </select>
                </div>

                <div style="margin-top: 10px;">
                  <label class="slds-form-element__label" for="link-name">Link name</label>
                  <input type="text" class="slds-input" id="link-name" name="link-name" />
                </div>

                <div style="width:80%; display: inline-block; padding-bottom: 0.15rem; margin-top: 10px;">
                  <label class="slds-form-element__label" for="field-value">Field Value</label>
                  <input type="text" class="slds-input" id="field-value" name="field-value" />
                </div>

                <div style="width:15%; display: inline-block; margin-bottom: 10px;">
                  <button type="button" class="slds-button slds-button_brand insert-btn"> Insert </button>
                </div>

                <div>
                <label class="slds-form-element__label">Content</label>

                </div>
                <div>
                <textarea
                  class="textarea-value"
                  style="border: 1px solid #dddbda; border-radius: 0.25rem; width: 100%; height: 200px; line-break: anywhere; font-size: 12px;"
                />

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
    const linkTabs = JSON.parse(config.linkTabs);

    const insertBtn = querySelector('.insert-btn');
    const linkSelect = querySelector('.linkTab-selection');
    const linkName = querySelector('#link-name');
    const fieldValue = querySelector('#field-value');
    const textArea = querySelector('.textarea-value');

    const textAreaValue = value ? value.value : '';

    linkSelect.removeChild(linkSelect.querySelector('option'));
    textArea.value = textAreaValue;

    // if nothing was preselected we ask the user to select
    if (value === null) {
      linkSelect.appendChild(placeHolderOption('Please Select'));
    }

    // We add recommenders to select box
    linkTabs.forEach((linkType) => {
      const linkTabOption = document.createElement('option');

      linkTabOption.value = linkType.id;
      linkTabOption.innerHTML = linkType.name;
      linkTabOption.dataset.link = linkType.link;
      if (linkType) {
        linkTabOption.title = linkType.name;
      }
      linkSelect.appendChild(linkTabOption);
    });

    insertBtn.addEventListener('click', () => {
      const selected = linkSelect.querySelector('option:checked');
      const link = selected.dataset.link;
      const name = linkName.value;

      textArea.value += link.replaceAll('{FIELD_VALUE}', fieldValue.value).replace('{LINK_NAME}', name);
      // textArea.scrollIntoView({ behavior: 'smooth', block: 'end' });
      emit({ type: 'sfcc:interacted' });
      emit({ type: 'sfcc:value', payload: { value: textArea.value }});
    });

    rootEditorElement.querySelectorAll('input, select').forEach((el) => el.addEventListener('change', () => {
      emit({ type: 'sfcc:interacted' });
    }));

    textArea.addEventListener('input', () => {
      emit({ type: 'sfcc:interacted' });

      // if (!textArea.value) {
      //   textArea.value = '<span></span>';
      // }

      emit({
        type: 'sfcc:value',
        payload: textArea.value ? { value: textArea.value } : null
      });
    });
  });

  // When a value was selected
  listen('sfcc:value', value => { });
  // When the editor must require the user to select something
  listen('sfcc:required', value => { });
  // When the editor is asked to disable its controls
  listen('sfcc:disabled', value => {
    if (rootEditorElement) {
      rootEditorElement.querySelectorAll('input, select').forEach((el) => el.disabled = true);
    }
  });

  init();
})();

