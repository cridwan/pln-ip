<script setup lang="ts" generic="T">
import { computed, ref, type PropType, type VNode } from "vue";
import { CreateRow, Input, Icon, Pagination } from "@/components";
import { dateFormatId } from "@/helpers/global";

export interface TableColumnType {
  key: string;
  label: string;
  align: "left" | "center" | "right";
  sort: boolean;
  width?: string | number;
}

export interface PaginationType {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

type EntityType = {
  activity_log: Record<string, any>,
  created_at: string;
  updated_at: string
};

type EnsureEntity<T> = T extends EntityType ? T : any;

const props = defineProps({
  columns: {
    type: Array as PropType<TableColumnType[]>,
    default: () => {
      return [];
    },
  },
  entities: {
    type: Array as PropType<EnsureEntity<T>[]>,
    default: () => {
      return [];
    },
  },
  isAction: {
    type: Boolean,
    default: true,
  },
  rowClickable: {
    type: Boolean,
    default: false,
  },
  labelCreate: {
    type: String,
    default: "",
  },
  isCreate: {
    type: Boolean,
    default: true,
  },
  isSearch: {
    type: Boolean,
    default: true,
  },
  isPagination: {
    type: Boolean,
    default: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  defaultLimit: {
    type: String as PropType<"10" | "20" | "50" | "100">,
    default: "10",
  },
  pagination: {
    type: Object as PropType<PaginationType>,
    default() {
      return {
        totalItems: 25,
        itemsPerPage: 10,
        currentPage: 1,
      };
    },
  },
  modelSearch: {
    type: String,
    default: null,
  },
});
const columns = computed(() => {
  return props.columns.concat([
    {
      label: "Created At",
      align: "left",
      key: "created_at",
      sort: false,
      width: 20,
    },
    {
      label: "Updated At",
      align: "left",
      key: "updated_at",
      sort: false,
      width: 20,
    },
    {
      label: "Created By",
      align: "left",
      key: "created_by",
      sort: false,
      width: 20,
    },
    {
      label: "Updated By",
      align: "left",
      key: "updated_by",
      sort: false,
      width: 20,
    }
  ]);
});
const emit = defineEmits([
  "search",
  "update:modelSearch",
  "rowClick",
  "changePage",
  "changeLimit",
  "create",
  "delete",
  "open-children",
]);

const open_create = ref(false);
const expandedRow = ref<number | null>(null);

const pagination_data = ref({
  totalItems: 100,
  itemsPerPage: 10,
  currentPage: 1,
});

const model_search = computed({
  get() {
    return props.modelSearch;
  },
  set(value) {
    emit("update:modelSearch", value);
  },
});

const styleWidthHeader = (column: TableColumnType) => {
  return {
    width:
      column.width !== undefined
        ? typeof column.width === "number"
          ? `${column.width}px`
          : `${column.width.replace("px", "")}px`
        : undefined,
    textAlign: column.align !== undefined ? column.align : undefined,
  };
};

const styleTitle = (align: string) => {
  if (align === undefined) {
    return {
      justifyContent: "center",
    };
  } else {
    return {
      justifyContent:
        align === "left"
          ? "flex-start"
          : align === "right"
            ? "flex-end"
            : "center",
    };
  }
};

const toggleRow = (index: number, item: T) => {
  expandedRow.value = expandedRow.value === index ? null : index;
  emit("open-children", expandedRow.value === null ? false : true, item);
};

const rowClick = (item: any, index: number) => {
  if (props.rowClickable) {
    emit("rowClick", { entity: item, index: index });
  }
};

const getValueByKey = (obj: any, key: string) => {
  return key?.split(".")?.reduce((o, k) => (o ? o[k] : undefined), obj) || "-";
};

defineSlots<{
  [key: `column_${string}`]: (props: { entity: T; index: number }) => VNode;
  [key: `header_${string}`]: (props: {
    header: TableColumnType | null;
  }) => VNode;
  children: (props: {
    entity: T;
    index: number;
    parentActive: number | null;
  }) => VNode;
}>();
</script>

<template>
  <div class="v-table">
    <div v-if="isSearch || isCreate" class="v-table--head" :class="isSearch ? 'justify-between' : 'justify-end'">
      <div v-if="isSearch" class="v-table-search">
        <Input rounded="full" size="sm" placeholder="Search" prefix_icon="search" v-model="model_search"
          @input="(e) => $emit('search', e)" />
      </div>
      <CreateRow v-if="isCreate" :label="labelCreate" @save="(e) => $emit('create', e)" />
    </div>
    <div class="v-table--body">
      <div class="v-table-wrapper">
        <table>
          <thead>
            <tr>
              <th v-for="(column, index) in columns" :key="index" :style="styleWidthHeader(column)" class="px-3 py-1.5">
                <div class="v-table-th-group" :style="styleTitle(column.align)">
                  <slot :name="`header_${column.key}`" :header="column">
                    <p class="v-table-th-text">{{ column.label }}</p>
                  </slot>
                </div>
              </th>
              <th v-if="isAction">
                <slot name="header_action" :header="null" />
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="columns.length + 1">
                <div class="w-full flex justify-center py-4 text-neutral-50 text-lg font-bold">
                  <p>Loading...</p>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && entities.length === 0">
              <td :colspan="columns.length + 1">
                <div class="w-full flex justify-center py-4 text-neutral-50 text-lg font-bold">
                  <p>Not Found Data</p>
                </div>
              </td>
            </tr>
            <template v-else-if="!loading && entities.length > 0" v-for="(entity, index) in entities"
              :key="`entity.${index}`">
              <tr :class="[{ 'row-clickable': rowClickable }, 'row-table']" @click="rowClick(entity, index)">
                <td v-for="(column, id) in columns" :key="`column.${index.toString() + id.toString()}`">
                  <div class="v-table-body">
                    <div v-if="column.key == 'created_by'">
                      <span class="text-white">{{ entity?.activity_log?.created_by?.name ?? "-" }}</span>
                    </div>
                    <div v-else-if="column.key == 'updated_by'">
                      <span class="text-white">{{ entity?.activity_log?.updated_by?.name ?? "-" }}</span>
                    </div>
                    <div v-else-if="column.key == 'created_at'">
                      <span class="text-white">{{ entity?.created_at ? dateFormatId(entity.created_at) : '-' }}</span>
                    </div>
                    <div v-else-if="column.key == 'updated_at'">
                      <span class="text-white">{{ entity?.updated_at ? dateFormatId(entity.updated_at) : "-" }}</span>
                    </div>
                    <slot :name="`column_${column.key}`" :entity="entity" :index="index" v-else>
                      <div class="flex items-center gap-4" :style="styleTitle(column.align)">
                        <Icon v-if="(entity as any)?.children && id === 0" name="caret-down"
                          class="cursor-pointer text-base transition-all duration-300"
                          :class="{ 'rotate-180': expandedRow === index }" @click.stop="toggleRow(index, entity)" />
                        <p class="v-table-body-text" :title="(entity as any)?.[column.key]">
                          {{ getValueByKey(entity, column.key) || "-" }}
                        </p>
                      </div>
                    </slot>
                  </div>
                </td>
                <td v-if="isAction" :class="`w-[5%]`">
                  <div class="v-table-body">
                    <slot name="column_action" :entity="entity" :index="index">
                      <Icon name="trash" class="table-delete" @click="() => $emit('delete', entity)" />
                    </slot>
                  </div>
                </td>
              </tr>
              <slot :name="'children'" :entity="entity" :index="index" :parentActive="expandedRow" />
              <!-- <template
                v-if="expandedRow === index"
                v-for="(child, childIndex) in (entity as any)?.children"
              >
                <tr>
                  <td
                    v-for="(column, id) in columns"
                    :key="`column.${index.toString() + id.toString()}`"
                    class="td-child"
                  >
                    <div class="v-table-body">
                      <slot
                        :name="`column_child_${column.key}`"
                        :parentEntity="entity"
                        :childEntity="child"
                        :parentIndex="index"
                        :childIndex="childIndex"
                      >
                        <div
                          class="flex items-center gap-4"
                          :style="styleTitle(column.align)"
                        >
                          <p
                            class="v-table-body-text"
                            :title="(child as any)?.[column.key]"
                          >
                            {{ getValueByKey(entity, column.key) || "-" }}
                          </p>
                        </div>
                      </slot>
                    </div>
                  </td>
                  <td v-if="isAction" class="td-child w-[5%]"></td>
                </tr>
              </template> -->
            </template>
          </tbody>
        </table>
      </div>
      <div v-show="!loading && entities.length > 0 && isPagination" class="mt-2">
        <Pagination :totalItems="pagination.totalItems" :itemsPerPage="pagination.itemsPerPage"
          :currentPage="pagination.currentPage" :defaultLimit="defaultLimit"
          @change-page="(e) => $emit('changePage', e)" @change-limit="(e) => $emit('changeLimit', e)" />
      </div>
    </div>
  </div>
</template>

<style lang="sass">
.v-table
  @apply flex flex-col gap-2
  &--head
    @apply flex items-center gap-5 mt-4
    .v-table-search
      @apply w-[25%]
  &--body
    .v-table-wrapper
      @apply overflow-x-auto
      > table
        @apply w-full border-separate border-spacing-y-1
        tbody
          tr
            td
              @apply bg-[rgb(47,85,151,0.6)] px-3 py-2
              .v-table-body
                .v-table-body-text
                  @apply text-base text-neutral-50
              &:first-child
                @apply rounded-l-lg
              &:last-child
                @apply rounded-r-lg
              .table-delete
                @apply text-neutral-50 cursor-pointer w-fit
            .td-child
              @apply bg-neutral-700/50
</style>
