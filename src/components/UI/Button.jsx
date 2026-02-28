import React from 'react'
import styles from './Button.module.css'

const VARIANTS = {
  primary: 'primary',
  secondary: 'secondary',
  ghost: 'ghost',
  danger: 'danger',
  icon: 'icon',
}

const SIZES = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
}

export const Button = ({
  children,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  onClick,
  title,
  className = '',
  type = 'button',
  ...rest
}) => {
  const cls = [styles.btn, styles[variant], styles[size], className].filter(Boolean).join(' ')
  return (
    <button
      type={type}
      className={cls}
      disabled={disabled}
      onClick={onClick}
      title={title}
      aria-label={title}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Button
