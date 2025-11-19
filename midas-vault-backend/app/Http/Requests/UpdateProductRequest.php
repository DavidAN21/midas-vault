<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string|min:10',
            'category' => 'sometimes|required|string|max:255',
            'condition' => 'sometimes|required|in:excellent,good,fair,poor',
            'price' => 'sometimes|required|numeric|min:1000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'allow_barter' => 'sometimes|boolean',
            'barter_preferences' => 'nullable|string|max:500',
            'allow_trade_in' => 'sometimes|boolean',
            'trade_in_value' => 'nullable|numeric|min:0',
            'trade_in_preferences' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi',
            'description.required' => 'Deskripsi produk wajib diisi',
            'description.min' => 'Deskripsi minimal 10 karakter',
            'price.required' => 'Harga produk wajib diisi',
            'price.min' => 'Harga minimal Rp 1.000',
            'image.image' => 'File harus berupa gambar',
            'image.mimes' => 'Format gambar harus jpeg, png, jpg, atau gif',
            'image.max' => 'Ukuran gambar maksimal 2MB',
        ];
    }
}