<template>
  <div class="structure-builder">
    <Toolbar>
      <template #left>
        <ComponentSelector
          color="success"
          :component-patterns="componentPatterns ? componentPatterns : []"
          :select-action="patternId => addComponent(patternId)"
        />
        <button v-if="clipboard" class="button is-info" @click="clearClipboard">
          Cancel {{ clipboard.type }}
        </button>
      </template>

      <template #middle>
        <div class="field search-container">
          <div class="control">
            <input
              :value="searchPhrase"
              type="search"
              class="input"
              placeholder="Highlight components with phrase"
              @input="searchByPhrase"
            />
          </div>
        </div>
      </template>

      <template #right>
        <a
          :href="previewLink($route.params.pageId)"
          class="button"
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          Preview
        </a>
        <button
          class="button is-info"
          :disabled="isDirty"
          :title="isDirty ? 'Save before publish' : ''"
          @click="publish"
        >
          Publish
        </button>
        <button
          class="button is-success"
          :disabled="!isDirty"
          @click="saveChanges"
        >
          Save
        </button>
      </template>
    </Toolbar>
    <div
      v-if="componentPatterns && componentPatterns.length"
      class="components-tree"
    >
      <ComponentTreeNode
        v-for="(component, index) in rootComponents"
        :key="component._id"
        :component="component"
        :first-root="index === 0"
        :component-patterns="componentPatterns"
        :get-child-components="getChildComponents"
        :empty-clipboard="clipboard === null"
        :search-phrase="searchPhrase"
        :edit="toggleModalComponent"
        :add="showComponentFinder"
        :rename="renameComponent"
        :remove="removeComponent"
        :clone="cloneComponent"
        :in-clipboard="inClipboard"
        :copy="copyComponentToClipboard"
        :cut="cutComponentToClipboard"
        :paste="pasteFromClipboard"
      />
    </div>
    <ComponentsFinder
      :component-patterns="componentPatterns"
      :add-component="addComponentInPlace"
      :show-finder="showFinder"
      :close-callback="closeFinder"
      :place-index="addToNodeParams.placeIndex"
      :parent-component-id="addToNodeParams.parentComponentId"
    />
    <ModalComponent
      :visible="editedComponent !== null"
      :component="editedComponent"
      :update-component="updateComponent"
      :component-patterns="componentPatterns"
      :toggle-visibility="toggleModalComponent"
      :save="saveChanges"
    />
    <Modal
      :toggle-visibility="toggleOtherUsersOnPageList"
      :visible="showOtherUsersOnPage"
    >
      Other users editing page:
      <div class="content">
        <ul>
          <li v-for="email of otherUsersOnPage" :key="email">
            <strong>{{ email }}</strong>
          </li>
        </ul>
      </div>
    </Modal>
    <FloatingButton
      v-if="!outdatedVersion && otherUsersOnPage.length"
      color="warning"
      title="Click to see who is editing this page"
      :on-click="toggleOtherUsersOnPageList"
    >
      <fa :icon="['fas', 'user-edit']" />
    </FloatingButton>

    <FloatingButton
      v-if="outdatedVersion"
      color="danger"
      style-type="text"
      title="Click to refresh the pate"
      :on-click="reloadPageData"
    >
      <span class="icon">
        <fa :icon="['fas', 'exclamation-triangle']" />
      </span>
      You see old page version - click to refresh
    </FloatingButton>
  </div>
</template>

<script>
import _debounce from 'lodash/debounce';
import { mapState, mapGetters, mapActions } from 'vuex';
import {
  ComponentSelector,
  ComponentsFinder,
  ComponentTreeNode,
  FloatingButton,
  Modal,
  ModalComponent,
  Toolbar,
} from '@/components';
import { getAllDescendants, targetComponentPosition } from '@/utils';

export default {
  components: {
    ComponentSelector,
    ComponentsFinder,
    ComponentTreeNode,
    FloatingButton,
    Modal,
    ModalComponent,
    Toolbar,
  },

  data() {
    return {
      searchPhrase: '',
      clipboard: null,
      addToNodeParams: {},
      showFinder: false,
      showOtherUsersOnPage: false,
      editedComponentId: null,
      latestVersion: null,
      otherUsersOnPage: [],
    };
  },

  computed: {
    ...mapState({
      componentPatterns: state => state.componentPatterns.componentPatterns,
      components: state => state.pageDetails.components,
      isDirty: state => state.isDirty,
      siteInfo: state => state.siteInfo,
      pageData: state => state.page.mainData,
      editingVersion: state => state.pageDetails.version,
    }),
    ...mapGetters('pageDetails', ['rootComponents']),
    ...mapGetters(['previewLink', 'loggedInUser']),

    editedComponent() {
      return this.editedComponentId
        ? this.components.find(
            component => component._id === this.editedComponentId
          )
        : null;
    },

    outdatedVersion() {
      return this.latestVersion && this.editingVersion !== this.latestVersion;
    },
  },

  mounted() {
    this.initPageData();
    const emitEventData = {
      user: this.loggedInUser,
      pageDetailsId: this.$route.params.pageDetailsId,
    };
    this.$socket.emit('who-page-details', emitEventData);
    this.$socket.emit('editing-page-details', emitEventData);
    this.$socket.on(
      'editing-page-details',
      this.onEditingDetailsEvent.bind(this)
    );
    this.$socket.on('who-page-details', this.onWhoPageDetails.bind(this));
    this.$socket.on(
      'left-page-details',
      this.onLeftPageDetailsEvent.bind(this)
    );
    this.$socket.on('update-page-structure', version => {
      if (version !== this.currentPageVersion) {
        this.latestVersion = version;
      }
    });
  },

  methods: {
    ...mapActions('pageDetails', [
      'addComponent',
      'addComponentInPlace',
      'copyComponent',
      'moveComponent',
      'renameComponent',
      'removeComponent',
      'reorderComponents',
      'updateComponent',
      'publishPageDetails',
    ]),

    onLeftPageDetailsEvent({ pageDetailsId, user }) {
      if (pageDetailsId !== this.$route.params.pageDetailsId) {
        return;
      }

      this.otherUsersOnPage = this.otherUsersOnPage.filter(
        loggedUser => loggedUser !== user
      );
    },

    onEditingDetailsEvent({ pageDetailsId, user }) {
      if (
        pageDetailsId === this.$route.params.pageDetailsId &&
        user !== this.loggedInUser &&
        !this.otherUsersOnPage.includes(user)
      ) {
        this.otherUsersOnPage = [...this.otherUsersOnPage, user];
      }
    },

    onWhoPageDetails({ pageDetailsId, user }) {
      if (
        pageDetailsId === this.$route.params.pageDetailsId &&
        user !== this.loggedInUser
      ) {
        this.$socket.emit('editing-page-details', {
          user: this.loggedInUser,
          pageDetailsId: this.$route.params.pageDetailsId,
        });
      }
    },

    publish() {
      this.publishPageDetails(this.$route.params.pageId);
    },

    toggleModalComponent(component) {
      this.editedComponentId = this.editedComponentId ? null : component._id;
    },

    clearClipboard() {
      this.clipboard = null;
    },

    inClipboard(componentId) {
      if (this.clipboard) {
        const clipboardNodeWithDescendant = getAllDescendants(
          this.clipboard.payload._id,
          this.components
        );

        return clipboardNodeWithDescendant.includes(componentId)
          ? this.clipboard.type
          : false;
      }

      return false;
    },

    getComponentPattern(patternId) {
      return this.componentPatterns.find(pattern => pattern._id === patternId);
    },

    async initPageData() {
      this.setBreadcrumbsLinks();

      await this.$store.dispatch(
        'pageDetails/fetchPageDetails',
        this.$route.params.pageDetailsId
      );

      await this.$store.dispatch('page/fetchPageData', {
        pageId: this.$route.params.pageId,
      });

      await this.$store.dispatch('componentPatterns/fetchComponentPatterns', {
        itemsPerPage: null,
      });

      await this.$store.dispatch('fetchSiteInfo');
    },

    async saveChanges() {
      await this.$store.dispatch('pageDetails/savePageDetails');
    },

    addToClipboard(actionType, position, payload) {
      this.clipboard = {
        type: actionType,
        position,
        payload,
      };
    },

    getComponentPosition(componentId) {
      let position;

      this.components.some((c, index) => {
        position = index;

        return c._id === componentId;
      });

      return position;
    },

    cloneComponent({ data, _id, componentPatternId, parentComponentId }) {
      this.copyComponent({
        parentComponentId,
        previousComponentId: _id,
        componentPatternId,
        clipboard: {
          type: 'copy',
          payload: {
            _id,
            componentPatternId,
            data,
          },
        },
      });
    },

    cutComponentToClipboard(component) {
      this.addToClipboard(
        'cut',
        this.getComponentPosition(component.id),
        component
      );
    },

    copyComponentToClipboard(component) {
      this.addToClipboard(
        'copy',
        this.getComponentPosition(component.id),
        component
      );
    },

    pasteFromClipboard(targetPlaceParams) {
      if (this.clipboard.type === 'copy') {
        this.copyComponent({
          ...targetPlaceParams,
          clipboard: this.clipboard,
        });
      } else if (this.clipboard.type === 'cut') {
        this.moveComponent({
          ...targetPlaceParams,
          clipboard: this.clipboard,
        });
      }

      this.clipboard = null;
    },

    showComponentFinder({ parentComponentId, ...targetPlaceParams }) {
      this.addToNodeParams = {
        placeIndex: targetComponentPosition({
          ...targetPlaceParams,
          components: this.components,
        }),
        parentComponentId,
      };

      this.showFinder = true;
    },

    closeFinder() {
      this.addToNodeParams = {};
      this.showFinder = false;
    },

    setBreadcrumbsLinks() {
      this.$store.commit('UPDATE_BREADCRUMBS_LINKS', [
        {
          url: '/',
          label: 'Home',
        },
        {
          url: `/pages/${this.$route.params.pageId}/edit/`,
          label: 'Page edit',
        },
        {
          url: `/pages/${this.$route.params.pageId}/structure/${this.$route.params.pageDetailsId}`,
          label: 'Page structure',
        },
      ]);
    },

    getChildComponents(parentId) {
      return this.components.filter(
        component => component.parentComponentId === parentId
      );
    },

    searchByPhrase: _debounce(function (evt) {
      this.searchPhrase = evt.target.value;
    }, 250),

    toggleOtherUsersOnPageList() {
      this.showOtherUsersOnPage = !this.showOtherUsersOnPage;
    },

    async reloadPageData() {
      if (confirm('Reloading will remove all unsaved changes!')) {
        await this.$store.dispatch(
          'pageDetails/fetchPageDetails',
          this.$route.params.pageDetailsId
        );
      }
    },
  },
};
</script>

<style scoped lang="postcss">
.add-component__container {
  display: flex;
  justify-content: flex-end;
  margin-top: var(--spacing);

  & > * {
    &:not(:last-of-type) {
      margin-right: var(--spacing);
    }
  }
}

.components-wrapper {
  & > *:not(:last-of-type) {
    margin-bottom: var(--spacing-2);
  }

  /* Fix issue with missing box shadow */
  &.smooth-dnd-container {
    &.vertical {
      & > .smooth-dnd-draggable-wrapper {
        overflow: visible;
      }
    }
  }
}

.components-tree {
  padding: var(--spacing-2) 0;
}

.search-container {
  width: 100%;
}
</style>
