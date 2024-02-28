import React from 'react';

import { Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { UserCreate } from '../../client';
import useCustomToast from '../../hooks/useCustomToast';
import { useUsersStore } from '../../store/users-store';
import { ApiError } from '../../client/core/ApiError';

interface AddUserProps {
    isOpen: boolean;
    onClose: () => void;
}

interface UserCreateForm extends UserCreate {
    confirm_password: string;

}

const AddUser: React.FC<AddUserProps> = ({ isOpen, onClose }) => {
    const showToast = useCustomToast();
    const { register, handleSubmit, reset, getValues, formState: { errors, isSubmitting } } = useForm<UserCreateForm>({
        mode: 'onBlur',
        criteriaMode: 'all',
        defaultValues: {
            email: '',
            full_name: '',
            password: '',
            confirm_password: '',
            is_superuser: false,
            is_active: false
        }
    });
    const { addUser } = useUsersStore();

    const onSubmit: SubmitHandler<UserCreateForm> = async (data) => {
        try {
            await addUser(data);
            showToast('Success!', 'User created successfully.', 'success');
            reset();
            onClose();
        } catch (err) {
            const errDetail = (err as ApiError).body.detail;
            showToast('Something went wrong.', `${errDetail}`, 'error');
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size={{ base: 'sm', md: 'md' }}
                isCentered
            >
                <ModalOverlay />
                <ModalContent as='form' onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>Add User</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6} >
                        <FormControl isRequired isInvalid={!!errors.email}>
                            <FormLabel htmlFor='email'>Email</FormLabel>
                            <Input id='email' {...register('email', { required: 'Email is required', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address' } })} placeholder='Email' type='email' />
                            {errors.email && <FormErrorMessage>{errors.email.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl mt={4} isInvalid={!!errors.full_name}>
                            <FormLabel htmlFor='name'>Full name</FormLabel>
                            <Input id='name' {...register('full_name')} placeholder='Full name' type='text' />
                            {errors.full_name && <FormErrorMessage>{errors.full_name.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl mt={4} isRequired isInvalid={!!errors.password}>
                            <FormLabel htmlFor='password'>Set Password</FormLabel>
                            <Input id='password' {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} placeholder='Password' type='password' />
                            {errors.password && <FormErrorMessage>{errors.password.message}</FormErrorMessage>}
                        </FormControl>
                        <FormControl mt={4} isRequired isInvalid={!!errors.confirm_password}>
                            <FormLabel htmlFor='confirm_password'>Confirm Password</FormLabel>
                            <Input id='confirm_password' {...register('confirm_password', {
                                required: 'Please confirm your password',
                                validate: value => value === getValues().password || 'The passwords do not match'
                            })} placeholder='Password' type='password' />
                            {errors.confirm_password && <FormErrorMessage>{errors.confirm_password.message}</FormErrorMessage>}
                        </FormControl>
                        <Flex mt={4}>
                            <FormControl>
                                <Checkbox {...register('is_superuser')} colorScheme='teal'>Is superuser?</Checkbox>
                            </FormControl>
                            <FormControl>
                                <Checkbox {...register('is_active')} colorScheme='teal'>Is active?</Checkbox>
                            </FormControl>
                        </Flex>
                    </ModalBody>
                    <ModalFooter gap={3}>
                        <Button bg='ui.main' color='white' _hover={{ opacity: 0.8 }} type='submit' isLoading={isSubmitting}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddUser;