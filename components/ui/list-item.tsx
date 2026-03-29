import { useColors } from '@/hooks/colors'
import { Pressable, PressableProps, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { UiText } from './text'

interface ListItemProps extends PressableProps {
  leadingComp?: () => React.ReactNode
  title: string
  subtitle?: string
  trailingComp?: () => React.ReactNode
}

const ITEM_HEIGHT = 64

export function ListItem({
  leadingComp: Leading,
  title,
  subtitle,
  trailingComp: Trailing,
  ...props
}: ListItemProps) {
  const colors = useColors()

  return (
    <Pressable {...props}>
      {({ pressed }) => (
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              height: ITEM_HEIGHT,
              paddingLeft: 8,
              paddingTop: 8,
              paddingBottom: 8,
              gap: 16,
              transition: 'all 100ms',
            },
            pressed && {
              backgroundColor: colors.hoverBackground,
              borderRadius: 8,
            },
          ]}>
          {Leading && (
            <View
              style={{
                height: ITEM_HEIGHT - 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Leading />
            </View>
          )}
          <View
            style={{
              flexDirection: 'column',
              gap: 4,
              justifyContent: 'center',
              flex: 1,
            }}>
            <UiText style={{ fontSize: 16 }} numberOfLines={1}>
              {title}
            </UiText>
            {subtitle && (
              <UiText style={{ opacity: 0.5, fontSize: 12 }} numberOfLines={2}>
                {subtitle}
              </UiText>
            )}
          </View>
          {Trailing && (
            <View
              style={{
                height: ITEM_HEIGHT - 16,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Trailing />
            </View>
          )}
        </Animated.View>
      )}
    </Pressable>
  )
}

export function ItemSeparator() {
  const colors = useColors()

  return (
    <View
      style={{
        backgroundColor: colors.foreground,
        opacity: 0.1,
        width: '100%',
        height: 1,
      }}
    />
  )
}
