import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ClayButton from '../ClayButton'

describe('ClayButton', () => {
  it('renders button with children', () => {
    render(<ClayButton>Click me</ClayButton>)

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<ClayButton onClick={handleClick}>Click me</ClayButton>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies primary variant class by default', () => {
    render(<ClayButton>Click me</ClayButton>)

    const button = screen.getByText('Click me')
    expect(button).toHaveClass('clay-btn')
  })

  it('applies orange variant class', () => {
    render(<ClayButton variant="orange">Click me</ClayButton>)

    const button = screen.getByText('Click me')
    expect(button).toHaveClass('clay-btn clay-btn-orange')
  })

  it('applies green variant class', () => {
    render(<ClayButton variant="green">Click me</ClayButton>)

    const button = screen.getByText('Click me')
    expect(button).toHaveClass('clay-btn clay-btn-green')
  })

  it('applies custom className', () => {
    render(<ClayButton className="custom-class">Click me</ClayButton>)

    const button = screen.getByText('Click me')
    expect(button).toHaveClass('custom-class')
  })

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn()
    render(
      <ClayButton onClick={handleClick} disabled>
        Click me
      </ClayButton>
    )

    const button = screen.getByText('Click me')
    fireEvent.click(button)
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('applies disabled styles when disabled', () => {
    render(<ClayButton disabled>Click me</ClayButton>)

    const button = screen.getByText('Click me')
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('sets button type correctly', () => {
    render(<ClayButton type="submit">Submit</ClayButton>)

    const button = screen.getByText('Submit')
    expect(button).toHaveAttribute('type', 'submit')
  })
})
