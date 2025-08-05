<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\City;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewEarlierDateFound;

class CompareDatumsTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $city;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Get the email from .env or use a default for testing
        $testEmail = env('MAIL_FROM_ADDRESS', 'test@example.com');
        
        // Create a test user
        $this->user = User::factory()->create([
            'email' => $testEmail,
            'send_notifications' => true
        ]);
        
        // Create Deurne city
        $this->city = City::create([
            'name' => 'Deurne',
            'code' => '1004',
            'company' => 'Autoveiligheid',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        
        // Associate user with city
        $this->user->cities()->attach($this->city->id);
        
        // Fake mail sending
        Mail::fake();
    }

    /** @test */
    public function it_validates_required_fields()
    {
        $response = $this->actingAs($this->user)
            ->postJson('/api/compare-datums', []);
            
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['newdatums', 'city']);
    }

    /** @test */
    public function it_handles_new_earlier_dates()
    {
        $testData = [
            'newdatums' => [
                [
                    'date' => now()->addDays(5)->format('Y-m-d'),
                    'text' => 'Test Date - Deurne',
                    'times' => ['09:00', '13:00']
                ]
            ],
            'city' => 'Deurne'
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/compare-datums', $testData);
            
        $response->assertStatus(200)
            ->assertJsonStructure(['notification_response']);
            
        // Assert that an email was sent to the user's email
        Mail::assertSent(NewEarlierDateFound::class, function ($mail) {
            return $mail->hasTo($this->user->email);
        });
    }

    /** @test */
    public function it_handles_no_new_earlier_dates()
    {
        $testData = [
            'newdatums' => [
                [
                    'date' => now()->addDays(10)->format('Y-m-d'),
                    'text' => 'Test Date - Deurne',
                    'times' => ['14:00', '16:00']
                ]
            ],
            'city' => 'Deurne'
        ];

        $response = $this->actingAs($this->user)
            ->postJson('/api/compare-datums', $testData);
            
        $response->assertStatus(200);
            
        // Assert that no email was sent since there are no new earlier dates
        Mail::assertNotSent(NewEarlierDateFound::class);
    }
}
