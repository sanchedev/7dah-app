import { useColors } from '@/hooks/colors'
import { Component } from '@/lib/types'
import {
  Pressable,
  PressableProps,
  useWindowDimensions,
  View,
} from 'react-native'
import Animated from 'react-native-reanimated'
import { UiText } from '../text'

export interface PressableCardProps extends PressableProps {
  image: Component<ImageCardProps>
  title: string
  subtitle?: string
  leading?: Component<{}>
}

export interface ImageCardProps {
  width: number
  height: number
  disabled: boolean
  pressed: boolean
}

export function PressableCard({
  image: Image,
  title,
  subtitle,
  leading: Leading,
  children,
  ...props
}: PressableCardProps) {
  const colors = useColors()
  const dimensions = useWindowDimensions()

  const minSize = Math.min(dimensions.height, dimensions.width)
  const cardSize = Math.max(0.5 * minSize - 32 - 2 * 8, 128)

  return (
    <Pressable {...props}>
      {({ pressed, hovered }) => (
        <Animated.View
          style={[
            {
              flexDirection: 'column',
              width: cardSize + 16,
              overflow: 'hidden',
              padding: 8,
              gap: 8,
              transition: 'all 100ms',
            },
            pressed && {
              backgroundColor: colors.hoverBackground,
              borderRadius: 16,
            },
            typeof props.style === 'function'
              ? props.style({ pressed, hovered })
              : props.style,
          ]}>
          <Image
            width={cardSize}
            height={cardSize}
            disabled={props.disabled ?? false}
            pressed={pressed}
          />
          <View style={{ flexDirection: 'row' }}>
            <View
              style={{
                flexDirection: 'column',
                gap: 4,
                justifyContent: 'center',
                flex: 1,
              }}>
              <UiText variant='h3' numberOfLines={1}>
                {title}
              </UiText>
              <UiText style={{ opacity: 0.5, fontSize: 14 }} numberOfLines={1}>
                {subtitle}
              </UiText>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {Leading && <Leading />}
            </View>
          </View>
        </Animated.View>
      )}
    </Pressable>
  )
}
