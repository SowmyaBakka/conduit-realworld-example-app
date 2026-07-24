Feature: Change password (EPMCDMETST-55333)

  Background:
    Given an authenticated user exists

  Scenario: Change password succeeds with correct current password
    When the user changes password with the correct current password
    Then the change password response is successful
    And login with the old password fails
    And login with the new password succeeds

  Scenario: Change password fails with wrong current password
    When the user changes password with a wrong current password
    Then the change password response is 422 with currentPassword is incorrect

  Scenario: Change password fails when new password is missing
    When the user changes password without providing a new password
    Then the change password response is 422 with a validation error
