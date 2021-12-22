<template>
  <div v-if="modelSchemas" class="component-add">
    <Toolbar>
      <template #left>
        <button class="button is-info" @click="addField">Add field +</button>

        <button class="button is-info" @click="addFieldset">
          Add fieldset +
        </button>
      </template>

      <template #middle>
        <button
          class="button is-outlined"
          @click="toggleComponentUsageVisibility"
        >
          <span>Check usage</span>
          <span class="icon">
            <fa :icon="['fas', 'eye']" />
          </span>
        </button>
      </template>

      <template v-if="unsavedState" #right>
        <button
          class="button is-success"
          @click="updateComponentPattern({ componentId })"
        >
          Update component
        </button>
      </template>
    </Toolbar>

    <Modal
      :toggle-visibility="toggleComponentUsageVisibility"
      :visible="comopnentUsageVisible"
    >
      <table
        v-if="componentUsage && componentUsage.length"
        class="table is-fullwidth is-striped"
      >
        <thead>
          <tr>
            <th>Page name</th>
            <th>URL</th>
            <th>Variant name</th>
          </tr>
        </thead>
        <tbody v-for="page of componentUsage" :key="page.pageId">
          <tr v-for="pageDetails of page.details" :key="pageDetails._id">
            <td>{{ page.name }}</td>
            <td>{{ page.url }}</td>
            <td>
              <nuxt-link
                :to="`/pages/${page.pageId}/structure/${pageDetails._id}`"
              >
                {{ pageDetails.name }}
              </nuxt-link>
            </td>
          </tr>
        </tbody>
      </table>
    </Modal>

    <Panel title="Main parameters">
      <Form
        :form-schema="formMainParameters"
        :values="componentPatternMainData"
        :update="updateMainParameters"
      />
    </Panel>

    <Panel
      v-if="componentPatternFields && componentPatternFields.length"
      title="Fields"
    >
      <div class="fields">
        <Container
          class="draggable-forms-container"
          drag-class="draggable-form__ghost"
          drop-class="draggable-form__ghost--drop"
          :group-name="`draggable-form-${randomId}`"
          drag-handle-selector=".draggable-form__grab-handler"
          :drop-placeholder="dropPlaceholderOptions"
          @drop="reorderFields"
        >
          <Draggable
            v-for="(field, index) of componentPatternFields"
            :key="index"
            class="fields__item"
          >
            <DraggableForm>
              <template #form>
                <Form
                  :form-schema="formFields"
                  :update="updateFields.bind(null, index)"
                  :self-destroy="removeField.bind(null, index)"
                  :remove-button-active="true"
                  :values="field"
                  :field-types="fieldTypes"
                />
              </template>
            </DraggableForm>
          </Draggable>

          <div class="component-dataset__actions">
            <button class="button is-small is-success" @click="addField">
              Add +
            </button>
          </div>
        </Container>
      </div>
    </Panel>

    <Panel
      v-for="(singleFieldset, singleFieldsetIndex) of componentPatternFieldset"
      :key="singleFieldsetIndex"
      title="Fieldset"
    >
      <Form
        :form-schema="formFieldset"
        :values="singleFieldset"
        :update="updateFieldsetData.bind(undefined, singleFieldsetIndex)"
      />
      <div class="fields">
        <Container
          class="draggable-forms-container"
          drag-class="draggable-form__ghost"
          drop-class="draggable-form__ghost--drop"
          :group-name="`draggable-form-${randomId}`"
          drag-handle-selector=".draggable-form__grab-handler"
          :drop-placeholder="dropPlaceholderOptions"
          @drop="
            dropResults => onFieldsetFieldDrop(singleFieldsetIndex, dropResults)
          "
        >
          <Draggable
            v-for="(field, index) of singleFieldset.fields"
            :key="index"
            class="fields__item"
          >
            <DraggableForm>
              <template #form>
                <Form
                  :form-schema="formFields"
                  :update="
                    updateFieldsetFieldData.bind(
                      undefined,
                      singleFieldsetIndex,
                      index
                    )
                  "
                  :self-destroy="
                    removeFieldsetField.bind(null, {
                      fieldsetIndex: singleFieldsetIndex,
                      fieldIndex: index,
                    })
                  "
                  :remove-button-active="true"
                  :values="field"
                  :field-types="fieldTypes"
                />
              </template>
            </DraggableForm>
          </Draggable>

          <div class="component-dataset__actions">
            <div class="component-dataset__actions-left">
              <button
                class="button is-small is-success"
                @click="addFieldsetField(singleFieldsetIndex)"
              >
                Add Field +
              </button>
            </div>
            <div class="component-dataset__actions-right">
              <button
                class="button is-small is-danger"
                @click="removeFieldset(singleFieldsetIndex)"
              >
                Remove fieldset
              </button>
            </div>
          </div>
        </Container>
      </div>
    </Panel>
  </div>
</template>

<script>
import { Draggable, Container } from 'vue-smooth-dnd';
import { mapGetters, mapState, mapActions } from 'vuex';
import { DraggableForm, Form, Modal, Panel, Toolbar } from '@/components';

export default {
  components: {
    Container,
    Draggable,
    DraggableForm,
    Form,
    Modal,
    Panel,
    Toolbar,
  },

  data() {
    return {
      comopnentUsageVisible: false,
      fieldset: [
        {
          fields: [{}],
        },
      ],
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    };
  },

  computed: {
    ...mapGetters('componentPatterns', [
      'formMainParameters',
      'formFields',
      'formFieldset',
      'randomId',
    ]),

    ...mapState('componentPatterns', [
      'componentPatternMainData',
      'componentPatternFields',
      'componentPatternFieldset',
      'fieldTypes',
      'unsavedState',
      'modelSchemas',
    ]),

    ...mapState({
      componentUsage(state) {
        return state.stats.componentsUsage[this.$route.params.componentId];
      },
    }),

    componentId() {
      return this.$route.params.componentId;
    },
  },

  mounted() {
    this.resetState();
    this.loadFieldsData();
    this.fetchSingleComponentPattern({
      componentId: this.$route.params.componentId,
    });
    this.fetchComponentUsage(this.$route.params.componentId);
    this.setBreadcrumbsLinks();
  },

  methods: {
    ...mapActions('componentPatterns', [
      'updateComponentPattern',
      'addField',
      'removeField',
      'addFieldset',
      'addFieldsetField',
      'fetchSingleComponentPattern',
      'loadFieldsData',
      'removeFieldset',
      'removeFieldsetField',
      'reorderFields',
      'reorderFieldsetFields',
      'resetState',
    ]),
    ...mapActions('stats', ['fetchComponentUsage']),

    updateMainParameters(fieldName, value) {
      this.$store.dispatch(
        'componentPatterns/updateComponentPatternMainParameters',
        {
          fieldName,
          value,
        }
      );
    },

    updateFields(fieldIndex, fieldName, value) {
      this.$store.dispatch('componentPatterns/updateComponentPatternField', {
        fieldIndex,
        fieldName,
        value,
      });
    },

    setBreadcrumbsLinks() {
      this.$store.commit('UPDATE_BREADCRUMBS_LINKS', [
        {
          url: '/',
          label: 'Home',
        },
        {
          url: `/components/`,
          label: 'Components',
        },
        {
          url: `/components/${this.componentId}`,
          label: 'Edit component',
        },
      ]);
    },

    updateFieldsetData(fieldsetIndex, fieldName, value) {
      this.$store.dispatch('componentPatterns/updateFieldsetData', {
        fieldsetIndex,
        fieldName,
        value,
      });
    },

    updateFieldsetFieldData(fieldsetIndex, fieldIndex, fieldName, value) {
      this.$store.dispatch(
        'componentPatterns/updateComponentPatternFieldsetField',
        {
          fieldsetIndex,
          fieldIndex,
          fieldName,
          value,
        }
      );
    },

    onFieldsetFieldDrop(fieldsetIndex, dropResult) {
      this.reorderFieldsetFields({ fieldsetIndex, dropResult });
    },

    toggleComponentUsageVisibility() {
      this.comopnentUsageVisible = !this.comopnentUsageVisible;
    },
  },
};
</script>

<style lang="postcss">
.fields {
  width: 100%;

  &__item {
    width: 100%;

    &:not(:last-of-type) {
      margin-bottom: var(--spacing);
    }
  }
}
</style>
