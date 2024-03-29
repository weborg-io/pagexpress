<template>
  <div class="component-selector__container">
    <div v-if="isSelectorVisible" class="component-selector">
      <div class="component-selector__inner">
        <div class="field autosuggest__wrapper">
          <div class="control is-expanded">
            <vue-autosuggest
              ref="autosuggest"
              v-model="autosuggestKeyword"
              :suggestions="autosuggestData"
              :input-props="{
                id: 'add-component',
                class: 'input has-icons-right component-selector__input',
                placeholder: 'Search component',
              }"
              :get-suggestion-value="getSuggestionValue"
              :section-configs="sectionConfigs"
            >
              <div
                slot-scope="{ suggestion }"
                class="autosuggest__results-item-inner"
              >
                <div class="autosuggest-item__row">
                  <span class="autosuggest__results-item-header">
                    {{ suggestion.item.label }} ({{ suggestion.item.name }})
                  </span>
                </div>
                <div class="autosuggest-item__row">
                  <p>{{ suggestion.item.description }}</p>
                </div>
              </div>
            </vue-autosuggest>
          </div>
        </div>
      </div>
      <a
        class="component-selector__close"
        @click.prevent="toggleSelectorVisibility"
      >
        <fa :icon="['fas', 'times']" />
      </a>
    </div>
    <button :class="cssClass" class="button" @click="toggleSelectorVisibility">
      {{ label ? label : 'Add component' }}
    </button>
  </div>
</template>

<script>
import { VueAutosuggest } from 'vue-autosuggest';
import { stringMatch } from '@/utils';

export default {
  name: 'ComponentSelector',
  components: {
    VueAutosuggest,
  },

  props: {
    placeholder: {
      type: String,
      default: 'Chose component',
    },

    label: {
      type: String,
      default: 'Add component',
    },

    color: {
      type: String,
      default: 'white',
    },

    size: {
      type: String,
      default: 'normal',
    },

    buttonStyle: {
      type: String,
      default: null,
    },

    componentPatterns: {
      type: Array,
      default: () => [],
    },

    selectAction: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      lastScrollTopPosition: 0,
      autosuggestKeyword: '',
      lastUsedPatternIds: [],
      lastUsedListLimit: 3,
      selectedPatternId: null,
      isSelectorVisible: false,
      sectionConfigs: {
        recent: {
          limit: 2,
          label: 'Recently used',
          onSelected: selected => {
            if (selected && selected.item) {
              this.addComponent(selected.item._id);
            }
          },
        },
        filtered: {
          limit: 5,
          label: 'Components',
          onSelected: selected => {
            if (selected && selected.item) {
              this.addComponent(selected.item._id);
            }
          },
        },
      },
    };
  },

  computed: {
    firstAutosuggestListData() {
      if (!this.lastUsedPatternIds.length || this.autosuggestKeyword.length) {
        return [];
      }

      const lastUsedPatternIds =
        this.lastUsedPatternIds.length > this.lastUsedListLimit
          ? this.lastUsedPatternIds.slice(-1 * this.lastUsedListLimit)
          : this.lastUsedPatternIds;

      return [
        {
          name: 'recent',
          data: lastUsedPatternIds.map(patternId => {
            const { _id, label, name, description } =
              this.componentPatterns.find(pattern => pattern._id === patternId);

            return {
              _id,
              label,
              name,
              description,
            };
          }),
        },
      ];
    },

    secondAutosuggestListData() {
      let componentPatternsData = this.componentPatterns.map(
        ({ _id, label, name, description }) => ({
          _id,
          label,
          name,
          description,
        })
      );

      if (this.autosuggestKeyword.length) {
        componentPatternsData = componentPatternsData.filter(
          pattern =>
            stringMatch(this.autosuggestKeyword, pattern.label) ||
            stringMatch(this.autosuggestKeyword, pattern.name)
        );
      }

      return [{ name: 'filtered', data: componentPatternsData }];
    },

    autosuggestData() {
      return [
        ...this.firstAutosuggestListData,
        ...this.secondAutosuggestListData,
      ];
    },

    cssClass() {
      let cssClass = `is-${this.size} is-${this.color}`;

      if (this.buttonStyle) {
        cssClass += ` is-${this.buttonStyle}`;
      }

      return cssClass;
    },
  },

  methods: {
    getSuggestionValue(suggestion) {
      return suggestion.item.label;
    },

    addComponent(selectedPatternId) {
      this.selectAction(selectedPatternId);
      this.lastUsedPatternIds.push(selectedPatternId);
      this.selectedPatternId = null;
      this.toggleSelectorVisibility();
    },

    toggleSelectorVisibility() {
      this.isSelectorVisible = !this.isSelectorVisible;

      if (this.isSelectorVisible) {
        this.toggleBlockingBodyHeight(true);

        setTimeout(() => {
          const autosuggestInput =
            this.$refs.autosuggest.$el.querySelector('input');
          autosuggestInput.click();
          autosuggestInput.focus();
          window.addEventListener('keyup', this.closeOnEscape);
        }, 0);
      } else {
        this.toggleBlockingBodyHeight();
        window.removeEventListener('keyup', this.closeOnEscape);
      }
    },

    toggleBlockingBodyHeight(shouldBlock) {
      if (shouldBlock) {
        this.lastScrollTopPosition =
          document.body.scrollTop || document.documentElement.scrollTop;
        window.document.body.style.maxHeight = '100vh';
        window.document.body.style.overflow = 'hidden';
      } else {
        window.document.body.removeAttribute('style');
        window.scrollTo(0, this.lastScrollTopPosition);
      }
    },

    closeOnEscape(evt) {
      if (this.isSelectorVisible && evt.key === 'Escape') {
        this.toggleSelectorVisibility();
      }
    },
  },
};
</script>

<style lang="postcss">
.component-selector {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  padding: var(--spacing-3) var(--spacing-2);
  background-color: var(--white);
  z-index: 999;

  &__inner {
    display: flex;
    justify-content: center;
  }

  &__input {
    border: 0;
    border-bottom: 2px solid var(--gray-darken);
    border-color: var(--black);
    height: 2.5em;
    font-size: 1.5rem;
    text-align: center;
    box-shadow: none;

    &:focus {
      border-bottom: 2px solid var(--black);
      box-shadow: none;
    }
  }

  &__close {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 1.6rem;
    padding: var(--spacing-025) var(--spacing-05);
    z-index: 999;
  }

  .autosuggest {
    &__results {
      padding-top: var(--spacing);

      &-container {
        box-shadow: none;
      }

      &-item {
        padding: var(--spacing);
        background-color: var(--gray-dark);
        border-radius: var(--border-radius);

        &:not(:last-of-type) {
          margin-bottom: var(--spacing);
        }

        &.autosuggest__results-item--highlighted,
        &:hover {
          background-color: var(--gray-darken);
          color: var(--white);
        }

        &-inner {
          display: flex;
          flex-direction: column;
        }

        &-header {
          font-weight: var(--font-weight-bold);
          font-size: var(--font-lg);
        }
      }

      &-before {
        padding: var(--spacing-05) 0;
      }

      & > ul {
        &:not(:last-of-type) {
          margin-bottom: var(--spacing);
        }
      }
    }

    &__wrapper {
      width: 100%;
    }
  }
}
</style>
