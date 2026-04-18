/**
 * UI组件自动代理导出
 *
 * ⚠️  此文件由脚本自动生成，请勿手动修改
 *
 * 生成命令：pnpm run generate:ui-proxy
 *
 * 策略：
 * 1. 自动扫描 ui 目录下的所有组件
 * 2. 如果 base 层有同名组件，优先使用 base 层的（需在脚本中配置）
 * 3. 否则直接导出 ui 层的组件并添加 Base 前缀
 *
 * 使用方式：
 * import { BaseButton, BaseInput } from '@/components/base/ui-proxy'
 */

// =============================================
// 自动生成的 UI 组件代理
// =============================================

// avatar 相关
export { Avatar as BaseAvatar } from '@/components/ui/avatar'
export { AvatarImage as BaseAvatarImage } from '@/components/ui/avatar'
export { AvatarFallback as BaseAvatarFallback } from '@/components/ui/avatar'

// badge 相关
export { Badge as BaseBadge } from '@/components/ui/badge'

// bg 相关
export { GradientBg as BaseGradientBg } from '@/components/ui/bg'
export { GridBg as BaseGridBg } from '@/components/ui/bg'
export { NatureBg as BaseNatureBg } from '@/components/ui/bg'
export { NatureBgBak as BaseNatureBgBak } from '@/components/ui/bg'
export { ParticlesBg as BaseParticlesBg } from '@/components/ui/bg'
export { WaveBg as BaseWaveBg } from '@/components/ui/bg'

// breadcrumb 相关
export { Breadcrumb as BaseBreadcrumb } from '@/components/ui/breadcrumb'
export { BreadcrumbEllipsis as BaseBreadcrumbEllipsis } from '@/components/ui/breadcrumb'
export { BreadcrumbItem as BaseBreadcrumbItem } from '@/components/ui/breadcrumb'
export { BreadcrumbLink as BaseBreadcrumbLink } from '@/components/ui/breadcrumb'
export { BreadcrumbList as BaseBreadcrumbList } from '@/components/ui/breadcrumb'
export { BreadcrumbPage as BaseBreadcrumbPage } from '@/components/ui/breadcrumb'
export { BreadcrumbSeparator as BaseBreadcrumbSeparator } from '@/components/ui/breadcrumb'

// card 相关
export { Card as BaseCard } from '@/components/ui/card'
export { CardHeader as BaseCardHeader } from '@/components/ui/card'
export { CardTitle as BaseCardTitle } from '@/components/ui/card'
export { CardContent as BaseCardContent } from '@/components/ui/card'
export { CardFooter as BaseCardFooter } from '@/components/ui/card'

// cursor 相关
export { FluidCursor as BaseFluidCursor } from '@/components/ui/cursor'

// dialog 相关
export { Dialog as BaseDialog } from '@/components/ui/dialog'
export { DialogClose as BaseDialogClose } from '@/components/ui/dialog'
export { DialogContent as BaseDialogContent } from '@/components/ui/dialog'
export { DialogDescription as BaseDialogDescription } from '@/components/ui/dialog'
export { DialogFooter as BaseDialogFooter } from '@/components/ui/dialog'
export { DialogHeader as BaseDialogHeader } from '@/components/ui/dialog'
export { DialogOverlay as BaseDialogOverlay } from '@/components/ui/dialog'
export { DialogScrollContent as BaseDialogScrollContent } from '@/components/ui/dialog'
export { DialogTitle as BaseDialogTitle } from '@/components/ui/dialog'
export { DialogTrigger as BaseDialogTrigger } from '@/components/ui/dialog'

// dropdown-menu 相关
export { DropdownMenu as BaseDropdownMenu } from '@/components/ui/dropdown-menu'
export { DropdownMenuTrigger as BaseDropdownMenuTrigger } from '@/components/ui/dropdown-menu'
export { DropdownMenuContent as BaseDropdownMenuContent } from '@/components/ui/dropdown-menu'
export { DropdownMenuItem as BaseDropdownMenuItem } from '@/components/ui/dropdown-menu'
export { DropdownMenuSeparator as BaseDropdownMenuSeparator } from '@/components/ui/dropdown-menu'

// icon 相关
export { Icon as BaseIcon } from '@/components/ui/icon'

// label 相关
export { Label as BaseLabel } from '@/components/ui/label'

// menubar 相关
export { Menubar as BaseMenubar } from '@/components/ui/menubar'
export { MenubarMenu as BaseMenubarMenu } from '@/components/ui/menubar'
export { MenubarTrigger as BaseMenubarTrigger } from '@/components/ui/menubar'
export { MenubarContent as BaseMenubarContent } from '@/components/ui/menubar'
export { MenubarItem as BaseMenubarItem } from '@/components/ui/menubar'
export { MenubarSeparator as BaseMenubarSeparator } from '@/components/ui/menubar'
export { MenubarLabel as BaseMenubarLabel } from '@/components/ui/menubar'
export { MenubarGroup as BaseMenubarGroup } from '@/components/ui/menubar'
export { MenubarSub as BaseMenubarSub } from '@/components/ui/menubar'
export { MenubarSubTrigger as BaseMenubarSubTrigger } from '@/components/ui/menubar'
export { MenubarSubContent as BaseMenubarSubContent } from '@/components/ui/menubar'

// navigation-menu 相关
export { NavigationMenu as BaseNavigationMenu } from '@/components/ui/navigation-menu'
export { NavigationMenuContent as BaseNavigationMenuContent } from '@/components/ui/navigation-menu'
export { NavigationMenuIndicator as BaseNavigationMenuIndicator } from '@/components/ui/navigation-menu'
export { NavigationMenuItem as BaseNavigationMenuItem } from '@/components/ui/navigation-menu'
export { NavigationMenuLink as BaseNavigationMenuLink } from '@/components/ui/navigation-menu'
export { NavigationMenuList as BaseNavigationMenuList } from '@/components/ui/navigation-menu'
export { NavigationMenuTrigger as BaseNavigationMenuTrigger } from '@/components/ui/navigation-menu'
export { NavigationMenuViewport as BaseNavigationMenuViewport } from '@/components/ui/navigation-menu'

// separator 相关
export { Separator as BaseSeparator } from '@/components/ui/separator'

// sonner 相关
export { Sonner as BaseSonner } from '@/components/ui/sonner'

// table 相关
export { Table as BaseTable } from '@/components/ui/table'
export { TableBody as BaseTableBody } from '@/components/ui/table'
export { TableCaption as BaseTableCaption } from '@/components/ui/table'
export { TableCell as BaseTableCell } from '@/components/ui/table'
export { TableEmpty as BaseTableEmpty } from '@/components/ui/table'
export { TableFooter as BaseTableFooter } from '@/components/ui/table'
export { TableHead as BaseTableHead } from '@/components/ui/table'
export { TableHeader as BaseTableHeader } from '@/components/ui/table'
export { TableRow as BaseTableRow } from '@/components/ui/table'

// tooltip 相关
export { Tooltip as BaseTooltip } from '@/components/ui/tooltip'
export { TooltipContent as BaseTooltipContent } from '@/components/ui/tooltip'
export { TooltipProvider as BaseTooltipProvider } from '@/components/ui/tooltip'
export { TooltipTrigger as BaseTooltipTrigger } from '@/components/ui/tooltip'

// tree-table 相关
export { TreeTable as BaseTreeTable } from '@/components/ui/tree-table'

// =============================================
// 手动维护的特殊导出（不会被自动覆盖）
// =============================================

// 在这里添加需要手动维护的导出
