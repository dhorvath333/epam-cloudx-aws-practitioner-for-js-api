import { Product } from "@src/models/product";

export const isProductValid = (product: Product): boolean => {
    const { title, description, price, count } = product;

    const isTitleValid = validateTitle(title);
    const isDescriptionValid = validateDescription(description);
    const isPriceValid = validatePrice(price);
    const isCountValid = validateCount(count);

    return isTitleValid && isDescriptionValid && isPriceValid && isCountValid;
}

function validateTitle(title: string): boolean {
    return !!title;
}

function validateDescription(description: string): boolean {
    return !!description;
}

function validatePrice(price: number): boolean {
    return !!price && Number.isInteger(price) && price > 0;
}

function validateCount(count: number): boolean {
    return !!count && Number.isInteger(count) && count >=0;
}