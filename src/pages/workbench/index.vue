<script setup lang="ts">
import { computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import AppTabBar from '@/components/AppTabBar.vue'
import { businessGroups } from '@/data/navigation'
import { useUserStore } from '@/stores/modules/user'
import { notifyError } from '@/utils/error'

const userStore = useUserStore()
const groups = computed(() =>
  businessGroups.filter((group) =>
    group.permissions.some((permission) => userStore.permissions.includes(permission)),
  ),
)

function openGroup(name: string) {
  notifyError(`${name}：业务接口接入后开放`)
}
</script>

<template>
  <view class="page workbench-page">
    <AppHeader
      title="工作台"
      :subtitle="`${userStore.factoryName} · ${groups.length} 个业务分组可用`"
    />
    <view class="workbench-content">
      <view class="section-heading"
        ><view
          ><text class="section-heading__title">全部应用</text
          ><text class="section-heading__desc">根据您的角色与权限展示</text></view
        ><view class="permission-tag"><wd-icon name="lock-on" size="12px" />权限已同步</view></view
      >
      <view class="group-grid">
        <view
          v-for="group in groups"
          :key="group.id"
          class="group-card"
          @click="openGroup(group.name)"
        >
          <view class="group-card__top"
            ><view
              class="group-card__icon"
              :style="{ color: group.color, backgroundColor: `${group.color}14` }"
              ><wd-icon :name="group.icon" size="27px" /></view
            ><text v-if="group.badge" class="group-card__badge">{{ group.badge }}</text
            ><wd-icon v-else name="arrow-right" size="16px" color="#c1ccd4"
          /></view>
          <text class="group-card__title">{{ group.name }}</text
          ><text class="group-card__desc">{{ group.description }}</text>
          <view class="group-card__actions"
            ><text v-for="action in group.actions.slice(0, 2)" :key="action">{{
              action
            }}</text></view
          >
        </view>
      </view>
      <view v-if="!groups.length" class="permission-empty"
        ><wd-icon name="lock-on" size="38px" /><text>暂无可用的业务应用</text
        ><text>请联系管理员分配移动端权限</text></view
      >
      <view class="workbench-tip"
        ><wd-icon name="info-circle" size="16px" /><text
          >当前为界面演示，业务数据以后端接入为准</text
        ></view
      >
    </view>
    <AppTabBar current="workbench" />
  </view>
</template>

<style scoped lang="scss">
.workbench-page {
  background: #f4f7f9;
}
.workbench-content {
  padding: 34rpx 24rpx 60rpx;
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 8rpx 26rpx;
}
.section-heading__title {
  display: block;
  font-size: 34rpx;
  font-weight: 700;
  color: #19364c;
}
.section-heading__desc {
  display: block;
  margin-top: 9rpx;
  font-size: 22rpx;
  color: #94a3af;
}
.permission-tag {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 10rpx 14rpx;
  color: #348e80;
  font-size: 20rpx;
  border-radius: 10rpx;
  background: #e8f6f1;
}
.group-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20rpx;
}
.group-card {
  padding: 28rpx 24rpx 24rpx;
  border: 1rpx solid #e9eef2;
  border-radius: 22rpx;
  background: #fff;
  box-shadow: 0 5rpx 18rpx rgba(27, 54, 75, 0.025);
}
.group-card:active {
  background: #f9fcfc;
}
.group-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.group-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 76rpx;
  height: 76rpx;
  border-radius: 22rpx;
}
.group-card__badge {
  min-width: 32rpx;
  height: 32rpx;
  line-height: 32rpx;
  text-align: center;
  color: #fff;
  background: #e76666;
  border-radius: 16rpx;
  font-size: 20rpx;
}
.group-card__title {
  display: block;
  margin-top: 26rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: #263e52;
}
.group-card__desc {
  display: block;
  margin-top: 10rpx;
  color: #98a5af;
  font-size: 22rpx;
}
.group-card__actions {
  display: flex;
  gap: 10rpx;
  margin-top: 22rpx;
  padding-top: 18rpx;
  border-top: 1rpx solid #f0f3f5;
}
.group-card__actions text {
  padding: 5rpx 10rpx;
  color: #7c909f;
  font-size: 19rpx;
  background: #f5f7f9;
  border-radius: 5rpx;
}
.permission-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18rpx;
  padding: 100rpx 0;
  color: #a0afb9;
  font-size: 25rpx;
}
.workbench-tip {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8rpx;
  margin-top: 36rpx;
  color: #9aaab5;
  font-size: 21rpx;
}
</style>
