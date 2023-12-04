export type SnackbarFunction = (message: string, autoHideDuration: number, variant?: "success" | "error" | "warning" | "info" | "default") => void

export type SnackbarProps = {
    message: string
    autoHideDuration: number
    variant?: "success" | "error" | "warning" | "info" | "default"
}